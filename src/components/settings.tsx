import React, { useContext, useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import UserContext from '../context/userContext';
import SubredditListItem from './subredditListItem';
import CategoryListItem from './categoryListItem';
import { ICategories } from './dash';
import Fetch from '../lib/fetch';
import { validateCategory, validateDuplicateSubreddits } from '../lib/validation';

/**
 * Private Route
 */

const initialSubredditValues = {
    subreddits: [
        {
            category: '',
            name: ''
        },
    ],
};

const initialCategoryValues = {
    categories: [
        {
            name: ''
        },
    ],
};

const Settings = () => {
    const { user, setUser } = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{ type: string, msg: string } | null>(null);

    const request = new Fetch();
    console.log(user);

    const handleOnDeleteSubreddit = async (subredditName: string, categoryName: string) => {

        setIsSubmitting(true);
        let subreddits = user.categories
            .filter((c: ICategories) => c.name === categoryName)[0].subreddits
            .filter((subreddit: string) => subreddit !== subredditName)

        /**
         *         const index = subreddits.indexOf(subredditName);
         *         const newArr = [...subreddits.slice(0,index), ...subreddits.slice(index+1)];
         */

        const data = {
            category: categoryName,
            subreddits
        }

        const res = await request.updateSubreddit(data);
        user.categories = res;
        const userState = user;
        userState['categories'] = res;
        setUser(userState);
        setIsSubmitting(false);
    }

    const handleOnSubredditSubmit = async (values: { subreddits: { category: string; name: string; }[] }) => {
        const { subreddits } = values;

        /**
         * If function is using async/await, you must use try/catch in order to throw Error handler. 
         * Error will bubble up to the parent catch block
         * 
         * https://javascript.info/async-await#error-handling
         */
        try {
            validateDuplicateSubreddits(values, user.categories);
            try {
                const req = await Promise.all(subreddits.map((s: { name: string }) => {
                    return fetch(`https://www.reddit.com/r/${s.name}.json`);
                })).catch(e => {
                    throw new Error('Invalid Subreddit');
                });

                if (req) {
                    const res = await Promise.all(req.map((r: any) => r.json()));
                    res.forEach(r => {
                        if (r.hasOwnProperty('error') || r.data.children.length === 0) {
                            throw new Error('Invalid Subreddit');
                        }
                    });
                }

            } catch (e) {
                setError({ type: 'subreddit', msg: e.message });
                return;
            }
        } catch (e) {
            setError({ type: 'subreddit', msg: e.message });
            return;
        }
        setIsSubmitting(true);
        let arr: any = []
        const obj: any = {}

        // loop through the values and separate the subreddits based on category
        values.subreddits.forEach(s => {
            const category = s.category || 'uncategorized';

            if (!obj[category]) {
                obj[category] = [s.name];
            } else {
                obj[category] = [...obj[category], s.name];
            }
        });

        for (let k in obj) {
            arr = [...arr, { category: k, names: obj[k] }]
        }

        const res = await Promise.all(arr.map((v: { category: string; names: string[] }) => {
            const categoryName = v.category;
            const subreddits = user.categories.filter((c: { name: string }) => c.name === categoryName)[0].subreddits;

            const data = {
                category: categoryName,
                subreddits: [...subreddits, ...v.names]
            };

            return request.updateSubreddit(data);
        }));

        user.categories = res;
        const userState = user;
        userState['categories'] = res[0];
        setUser(userState);
        setIsSubmitting(false);
        setError(null);
    }

    const handleOnCategorySubmit = async (values: { categories: { name: string; }[] }) => {
        const { categories } = values;
        let userState;

        try {
            validateCategory(values, user.categories, user.subreddits)
            try {
                const res = await Promise.all(categories.map((c: { name: string }) => {
                    return request.createCategory(c);
                }));

                setIsSubmitting(true);
                user.categories = res;
                userState = user;
                userState['categories'] = res[0];
            } catch (e) {
                throw new Error('Network error. Try again later.')
            }
        } catch (e) {
            setError({ type: 'category', msg: e.message });
            return;
        }

        setUser(userState);
        setIsSubmitting(false);
        setError(null);
    }

    const handleOnSaveCategory = async (subreddit: string, prevCategory: string, newCategory: string) => {

        setIsSubmitting(true);

        // get the subreddits for prevCategory and newCategory
        let prev = user.categories
            .filter((c: ICategories) => c.name === prevCategory)[0].subreddits;

        let next = user.categories
            .filter((c: ICategories) => c.name === newCategory)[0].subreddits;

        // remove subreddit from prevCategory array & insert subreddit into newCategory
        prev = prev.filter((s: string) => s !== subreddit);
        next = [...next, subreddit];

        const data = [
            { category: prevCategory, subreddits: prev },
            { category: newCategory, subreddits: next },
        ];

        const res = await Promise.all(data.map((d: { category: string, subreddits: string[] }) => {
            return request.updateSubreddit(d);
        }));

        user.categories = res;
        const userState = user;
        userState['categories'] = res[1];
        setUser(userState);
        setIsSubmitting(false);
    }

    const renameCategory = async (id: number, category: string) => {
        try {
            validateCategory({ categories: [{ name: category }] }, user.categories);
        } catch (e) {
            setError({ type: 'category', msg: e.message });
            return;
        }
        setIsSubmitting(true);
        const res = await request.renameCategory({ id, category });
        user.categories = res;
        const userState = user;
        userState['categories'] = res;
        setUser(userState);
        setError(null);
        setIsSubmitting(false);
    }

    const deleteCategory = async (id: number, category: string) => {
        setIsSubmitting(true);
        // merge subreddits from deleted category to Uncategorized
        const orphanedSubs = getCategorySubreddits(category);
        const uncategorizedSubs = getCategorySubreddits('uncategorized');
        const data = [...uncategorizedSubs, ...orphanedSubs];
        const res = await request.deleteCategory({ mergedSubs: data, category });
        user.categories = res;
        const userState = user;
        userState['categories'] = res;
        setUser(userState);
        setIsSubmitting(false);
    }

    const getCategorySubreddits = (category: string) => {
        return user.categories
            .filter((c: ICategories) => c.name === category)[0].subreddits;
    }

    return isSubmitting ? <div>saving</div> : (
        <div>
            <h3>Categories</h3>
            <p>List all user's categories</p>
            <ul>
                {user.categories.map((category: { category_id: number, name: string, subreddits: [] }, index: number) => {
                    const { name, category_id } = category;
                    return (
                        <CategoryListItem
                            key={`${name}-${index}`}
                            id={category_id}
                            name={name}
                            renameCategory={renameCategory}
                            deleteCategory={deleteCategory}
                        />
                    )
                })}
            </ul>
            <Formik
                initialValues={initialCategoryValues}
                onSubmit={async (values) => {
                    handleOnCategorySubmit(values);
                }}
            >
                {({ values }) => (
                    <Form>
                        <FieldArray name="categories">
                            {({ insert, remove, push }) => (
                                <div>
                                    {values.categories.length > 0 &&
                                        values.categories.map((category, index) => (
                                            <div className="row" key={index}>
                                                <div className="col">
                                                    <label htmlFor={`categories.${index}.name`}>Name</label>
                                                    <Field
                                                        name={`categories.${index}.name`}
                                                        placeholder="Jane Doe"
                                                        type="text"
                                                        required
                                                    />
                                                    <ErrorMessage
                                                        name={`categories.${index}.name`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <button
                                                        type="button"
                                                        className="secondary"
                                                        onClick={() => remove(index)}
                                                    >
                                                        X
                        </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => push({ name: '' })}
                                    >
                                        Add Category
                </button>
                                </div>
                            )}
                        </FieldArray>
                        <button type="submit">Submit</button>
                        {error && error.type === "category" && <span style={{ color: 'red' }}>{error.msg}</span>}
                    </Form>
                )}
            </Formik>


            <h3>Subreddits</h3>
            <p>List all user's subreddits along with it's category</p>
            <ul>
                {user.categories.map((category: { category_id: number, name: string, subreddits: [] }, index: number) => {
                    const { name, subreddits } = category;
                    return (
                        <div key={`${name}-${index}`}>
                            <p>{name} {subreddits.length}</p>
                            {subreddits.map((subreddit: string, index: number) => {
                                return (
                                    <SubredditListItem
                                        categories={user.categories}
                                        category={category.name}
                                        subredditName={subreddit}
                                        key={`${subreddit}-${index}`}
                                        deleteSub={handleOnDeleteSubreddit}
                                        saveCategory={handleOnSaveCategory}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </ul>
            <Formik
                initialValues={initialSubredditValues}
                onSubmit={async (values) => {
                    handleOnSubredditSubmit(values);
                }}
            >
                {({ values }) => (
                    <Form>
                        <FieldArray name="subreddits">
                            {({ insert, remove, push }) => (
                                <div>
                                    {values.subreddits.length > 0 &&
                                        values.subreddits.map((subreddit, index) => (
                                            <div className="row" key={index}>
                                                <div className="col">
                                                    <label htmlFor={`subreddits.${index}.name`}>Name</label>
                                                    <Field
                                                        name={`subreddits.${index}.name`}
                                                        placeholder="Jane Doe"
                                                        type="text"
                                                        required
                                                    />
                                                    <ErrorMessage
                                                        name={`subreddits.${index}.name`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor={`subreddits.${index}.category`}>Category</label>
                                                    <Field
                                                        name={`subreddits.${index}.category`}
                                                        as="select"
                                                    >
                                                        <option value="">Select</option>
                                                        {user.categories.map((category: { name: string }, i: number) => {
                                                            return <option key={`${i}-${category}`} value={category.name}>{category.name}</option>
                                                        })}

                                                    </Field>
                                                </div>
                                                <div className="col">
                                                    <button
                                                        type="button"
                                                        className="secondary"
                                                        onClick={() => remove(index)}
                                                    >
                                                        X
                        </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => push({ name: '' })}
                                    >
                                        Add Subreddit
                </button>
                                </div>
                            )}
                        </FieldArray>
                        <button type="submit">Submit</button>
                        {error && error.type === "subreddit" && <span style={{ color: 'red' }}>{error.msg}</span>}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Settings;