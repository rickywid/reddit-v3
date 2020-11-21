import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../context/userContext';
import GetStartedForm from './getStartedForm';


// Todo: Clean up interfaces
export interface ICategories {
    category_name: string;
    data: string[];
}

interface IResponseData {
    data: {
        data: any;
    }[]
}

interface ISubreddits {
    category_name: string,
    data: {
        subreddit_name: string;
        data: IResponseData[];
    }[]
}

export interface IGetStartedData {
    subreddits: {
        category?: string;
        name: string;
    }[]
}



const User = () => {
    const { user, setUser } = useContext(UserContext);
    const [selectedCategory, setCategory] = useState<string>('All');            // Selected Category value
    const [intialSubreddits, setInitialSubreddits] = useState<string[]>([]);    // State will be initialized if user has no subreddits
    const [subreddits, setSubs] = useState<ISubreddits[]>([]);                  // State will be initialized if the user is already following subreddits
    const [isLoading, setIsLoading] = useState<boolean>(true);                  // Check if fetch requests has completed
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false);       // Check if the form is currently being submitted when <GetStartedForm /> component is mounted

    useEffect(() => {
        const fetch = async () => {
            const req: ISubreddits[] = await fetchSubs();
            setSubs(req);
            setIsLoading(false);
        }

        fetch();
    }, [selectedCategory, formSubmitting]);

    const changeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setIsLoading(true);
        setCategory(value);
    }

    /**
     * If user has no subreddits, <GetStartedForm /> component will render.
     * After user submits form, form data(subreddits) will be passed to formSubmit()
     * 
     * @param values 
     */
    const formSubmit = (values: IGetStartedData) => {
        setInitialSubreddits(values.subreddits.map((s: { name: string }) => s.name));
        setFormSubmitting(true);
    }

    /**
     * fetchSubs() will make a request to fetch the subreddit(s) data
     */
    const fetchSubs = async () => {
        // TODO: Refactor
        const { categories } = user;

        if (selectedCategory === 'All') {

            // Get all the subreddits for the selected categories
            const data: [IResponseData][] = await Promise.all(categories.map(async (category: ICategories) => {

                // When the user first logs into the site, user's subreddit data will be empty. In that case, use that the values from initialSubreddits
                const subreddits = category.data.length ? category.data : intialSubreddits;
                const res = await Promise.all(subreddits.map(subreddit => (
                    fetch(`https://www.reddit.com/r/${subreddit}.json`))));
                const req = await Promise.all(res.map(r => r.json()));
                return req;
            }));

            return build(data, categories);

        } else {
            const category = categories
                .map((category: ICategories): string[] => category.category_name === selectedCategory ? category.data : [])
                .filter((c: string[]) => c.length > 0);

            if (!category.length) { return []; }

            const res = await Promise.all(category[0].map((subreddit: string) => (
                fetch(`https://www.reddit.com/r/${subreddit}.json`))));
            const data = await Promise.all(res.map((r: any) => r.json()));

            return build(data);
        }
    }

    /**
     * Build the data structure
     */
    const build = (x: any, categories?: any) => {
        let arr: any[] = [];

        if (categories) {
            // loop through categories
            arr = categories.map((category: any, i: number) => {

                /**
                 *  When the user first logs into the site, user's subreddit data will be empty. In that case, use that the values from initialSubreddits
                 */
                const subreddits = category.data.length ? category.data : intialSubreddits;
                const data = subreddits.map((s: string, j: number) => {
                    const data: any = x[i][j];

                    return {
                        subreddit_name: s,
                        data: data.data.children
                    }
                });

                return {
                    category_name: category.name,
                    data
                }
            })
        } else {
            arr = x.map((s: string, j: number) => {
                const { children } = x[j].data;
                const subreddit_name: string = children[0].data.subreddit
                const data: any = children

                return {
                    subreddit_name,
                    data
                }
            });
        }

        return arr;
    }

    return isLoading ? <div>loading</div> : (
        <div>
            {user.categories.length ? (
                <div>
                    <div>
                        <p>Category: {selectedCategory}</p>
                        <select name="categories" id="categories" onChange={changeCategory} value={selectedCategory}>
                            <option value="All">All</option>
                            {user.categories.map((category: ICategories, i: number) => {
                                return <option key={`${i}-${category}`} value={category.category_name}>{category.category_name}</option>
                            })}
                        </select>
                        {selectedCategory === 'All' ? user.categories.map((category: ICategories, i: number) => {
                            return (
                                <div key={`${i}-${category}`}>
                                    <h3>{category.category_name}</h3>
                                    <ul>
                                        {category.data.map((data: string, i: number) => {
                                            return <li key={`${i}-${data}`}>{data}</li>
                                        })}
                                    </ul>
                                </div>
                            )
                        }) :
                            user.categories.map((category: ICategories, i: number) => {
                                if (category.category_name === selectedCategory) {
                                    return (
                                        <div key={`${i}-${category}`}>
                                            <h3>{category.category_name}</h3>
                                            <ul>
                                                {category.data.map((data: string, i: number) => {
                                                    return <li key={`${i}-${data}`}>{data}</li>
                                                })}
                                            </ul>
                                        </div>
                                    )
                                }

                                return <div></div>
                            })
                        }
                    </div>


                    {/** Display ALL categories */}

                    {selectedCategory === 'All' && (
                        <div>
                            {subreddits.map((subreddit: ISubreddits, i: number) => {
                                return (
                                    <div key={`${subreddit.category_name}-${i}`}>
                                        <h3>{subreddit.category_name}</h3>
                                        {subreddit.data.map((d: any) => {
                                            return <li key={`${d.subreddit_name}-${i}`}>
                                                <span>{d.subreddit_name}</span>
                                                <ul>
                                                    {d.data.map((s: { data: { title: string } }) => <li key={`${s.data.title}-${i}`}>{s.data.title}</li>)}
                                                </ul>
                                            </li>
                                        })}

                                    </div>
                                )
                            })}
                        </div>
                    )}


                    {/** Display SELECTED category */}

                    {selectedCategory !== 'All' && (
                        <div>

                            {subreddits.length ?
                                subreddits.map((d: any, i: number) => {
                                    return <li key={`${d.subreddit_name}-${i}`}>
                                        <p>{d.subreddit_name}</p>
                                        <ul>
                                            {d.data.map((s: { data: { title: string } }) => <li key={`${s.data.title}-${i}`}>{s.data.title}</li>)}
                                        </ul>
                                    </li>
                                })
                                : <p>No Subreddits</p>}

                        </div>
                    )}
                </div>
            ) : (
                    <div>
                        <h2>Start Adding Your Favourite Subreddits</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, eveniet soluta, praesentium ea ut repudiandae, perspiciatis neque corrupti perferendis!</p>

                        <GetStartedForm formSubmit={formSubmit} />
                    </div>
                )}
        </div >
    )
}

export default User;


/**
 * const arr = [
                {
                    category_name: 'technology',
            (obj)   data: [
                        {
                            subreddit_name: 'thinkpad',
                            data: []
                        },
                        {
                            subreddit_name: 'fedora',
                            data: []
                        },
                    ]
                },
                {
                    category_name: 'sports',
                    data: [
                        {
                            subreddit_name: 'raptors',
                            data: []
                        },
                        {
                            subreddit_name: 'bluejays',
                            data: []
                        },
                    ]
                }
            ]
 */