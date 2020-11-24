import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../context/userContext';
import GetStartedForm from './getStartedForm';
import { MessageTwoTone, LoadingOutlined, RedditCircleFilled, VideoCameraTwoTone, StarTwoTone, PictureTwoTone } from '@ant-design/icons';
import moment from 'moment';

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
    const [selectedCategory, setCategory] = useState<string>(localStorage.getItem('selectedCategory') || 'All');            // Selected Category value
    const [intialSubreddits, setInitialSubreddits] = useState<string[]>([]);    // State will be instantiated if user has no subreddits
    const [subreddits, setSubs] = useState<ISubreddits[]>([]);                  // State will be instantiated after fetchSubs() is ran
    const [isLoading, setIsLoading] = useState<boolean>(true);                  // Check if fetch requests has completed
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false);       // Check if the form is currently being submitted when <GetStartedForm /> component is mounted

    useEffect(() => {
        const fetch = async () => {
            let req: ISubreddits[];;
            if (formSubmitting) {
                req = await fetchSubsInitial();
            } else {
                req = await fetchSubs();
            }

            setSubs(req);
            setIsLoading(false);
        }

        fetch();
    }, [selectedCategory, formSubmitting]);

    const changeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setIsLoading(true);
        localStorage.setItem('selectedCategory', value);
        setCategory(value);
    }

    /**
     * If user has no subreddits, <GetStartedForm /> component will render.
     * After user submits form, form data(subreddits) will be passed to formSubmit()
     * 
     * @param values 
     */
    const formSubmit = (values: IGetStartedData) => {
        const data = values.subreddits.map((s: { name: string }) => s.name);
        setInitialSubreddits(data);

        // Update the user's Uncategorized array
        const userState = user;
        userState['categories'][0].data = data;
        setUser(userState);
        setFormSubmitting(true);
    }

    const fetchSubsInitial = async () => {
        const data: [IResponseData][] = await Promise.all(user.categories.map(async (category: ICategories) => {
            if (category.category_name === 'uncategorized') {
                // When the user first logs into the site, user's subreddit data will be empty. In that case, use that the values from initialSubreddits
                // const subreddits = category.data.length ? category.data : ;
                const res = await Promise.all(category.data.map(subreddit => (
                    fetch(`https://www.reddit.com/r/${subreddit}.json`))));
                const req = await Promise.all(res.map(r => r.json()));
                return req;
            } else {
                return [];
            }
        }));
        return build(data, user.categories);
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
                const subreddits = category.data;
                const data = subreddits.map((s: string, j: number) => {
                    const data: any = x[i][j];
                    return {
                        subreddit_name: s,
                        data: data.data.children
                    }
                });

                return {
                    category_name: category.category_name,
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

    /**
     * Check if all of the user's categories are empty - (user is not following any subreddits)
     * Show the GetStartedComponent if true
     */
    const isSubredditsEmpty = user.categories.filter((c: any) => c.data.length > 0);

    return isLoading ? <div><LoadingOutlined /></div> : (
        <div style={{margin: 'auto'}}>
            {isSubredditsEmpty.length > 0 ? (
                <div className="container">
                    <div className="category-col">
                        <select name="categories" id="categories" onChange={changeCategory} value={selectedCategory} style={{ margin: '20px 0' }}>
                            <option value="All">All</option>
                            {user.categories.map((category: ICategories, i: number) => {
                                return <option key={`${i}-${category}`} value={category.category_name}>{category.category_name}</option>
                            })}
                        </select>
                        <aside>
                            {selectedCategory === 'All' ? user.categories.map((category: ICategories, i: number) => {
                                return (
                                    <div key={`${i}-${category}`}>
                                        <h5><a href={`#${category.category_name}`}>{category.category_name}</a></h5>
                                        {category.data.length ? (
                                            <ul>
                                                {category.data.map((data: string, i: number) => {
                                                    return <li key={`${i}-${data}`}><a href={`#${data}`} className="category-subreddit-item">{data}</a></li>
                                                })}
                                            </ul>
                                        ) : <p className="category-subreddit-item none">(none)</p>}
                                    </div>
                                )
                            }) :
                                user.categories.map((category: ICategories, i: number) => {
                                    if (category.category_name === selectedCategory) {
                                        return (
                                            <div key={`${i}-${category}`}>
                                                <ul>
                                                    {category.data.map((data: string, i: number) => {
                                                        return <li key={`${i}-${data}`}><a href={`#${data}`} className="category-subreddit-item">{data}</a></li>
                                                    })}
                                                </ul>
                                            </div>
                                        )
                                    }

                                    return <div></div>
                                })
                            }
                            <ul style={{ marginTop: '50px' }}>
                                <li><a href="https://reddit.com" className="visit-reddit"><RedditCircleFilled style={{ marginRight: '10px' }} />Visit Reddit</a></li>
                            </ul>
                        </aside>
                    </div>


                    {/** Display ALL categories */}

                    {selectedCategory === 'All' && (
                        <div>
                            {subreddits.map((subreddit: ISubreddits, i: number) => {
                                return subreddit.data.length > 0 && (
                                    <section key={`${subreddit.category_name}-${i}`}>
                                        <h3 id={subreddit.category_name}>{subreddit.category_name}</h3>
                                        {subreddit.data.map((d: any) => {
                                            return <div key={`${d.subreddit_name}-${i}`}>
                                                <h4 id={d.subreddit_name} className="border">{d.subreddit_name}</h4>
                                                <ul>
                                                    {d.data.map((s: { data: { title: string, url: string, num_comments: number, created_utc: number, all_awardings: any[], stickied: boolean, permalink: string, is_video: boolean, gilded: number, thumbnail: string } }) => {
                                                        return (
                                                            <li key={`${s.data.title}-${i}`}>
                                                            <a href={s.data.url} target="__blank" className={s.data.stickied ? 'sticky' : ''} style={{ marginRight: '10px' }}>{s.data.title}</a>
                                                            {s.data.gilded > 0 && <span style={{ marginRight: '5px' }}><StarTwoTone twoToneColor="#ff9800" /></span>}
                                                            {s.data.is_video && <span style={{ marginRight: '5px' }}><VideoCameraTwoTone /></span>}
                                                            {s.data.thumbnail && s.data.thumbnail !== 'self' && s.data.thumbnail !== 'default' && <span style={{ marginRight: '5px' }}> <PictureTwoTone /></span>}
                                                            {s.data.all_awardings.map((a: any) => {
                                                                if (a.count > 0) {
                                                                    return <span><img src={a.icon_url} style={{ height: '12px' }} alt={a.name} /></span>
                                                                }
                                                            })}
                                                            <a className="comments" href={`https://reddit.com/${s.data.permalink}`} target="__blank"><MessageTwoTone twoToneColor="#6f8ea3" /> <strong><small>{s.data.num_comments}</small></strong></a>
                                                            <small className="created">{moment(s.data.created_utc * 1000).fromNow()}</small>
                                                        </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        })}

                                    </section>
                                )
                            })}
                        </div>
                    )}


                    {/** Display SELECTED category */}

                    {selectedCategory !== 'All' && (
                        <section>
                            {subreddits.length ?
                                subreddits.map((d: any, i: number) => {
                                    return <div key={`${d.subreddit_name}-${i}`}>
                                        <h4 id={d.subreddit_name} className="border">{d.subreddit_name}</h4>
                                        <ul>
                                            {d.data.map((s: { data: { title: string, url: string, num_comments: number, created_utc: number, all_awardings: any[], stickied: boolean, permalink: string, is_video: boolean, gilded: number, thumbnail: string } }) => {
                                                return (
                                                    <li key={`${s.data.title}-${i}`}>
                                                        <a href={s.data.url} target="__blank" className={s.data.stickied ? 'sticky' : ''} style={{ marginRight: '10px' }}>{s.data.title}</a>
                                                        {s.data.gilded > 0 && <span style={{ marginRight: '5px' }}><StarTwoTone twoToneColor="#ff9800" /></span>}
                                                        {s.data.is_video && <span style={{ marginRight: '5px' }}><VideoCameraTwoTone /></span>}
                                                        {s.data.thumbnail && s.data.thumbnail !== 'self' && <span style={{ marginRight: '5px' }}> <PictureTwoTone /></span>}
                                                        {s.data.all_awardings.map((a: any) => {
                                                            if (a.count > 0) {
                                                                return <span><img src={a.icon_url} style={{ height: '12px' }} alt={a.name} /></span>
                                                            }
                                                        })}
                                                        <a className="comments" href={`https://reddit.com/${s.data.permalink}`} target="__blank"><MessageTwoTone twoToneColor="#6f8ea3" /> <strong><small>{s.data.num_comments}</small></strong></a>
                                                        <small className="created">{moment(s.data.created_utc * 1000).fromNow()}</small>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                })
                                : <p>No Subreddits</p>}

                        </section>
                    )}
                </div>
            ) : (
                    <div>
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