import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../context/userContext';
import Fetch from '../lib/fetch';
import GetStartedForm from './getStartedForm';

interface ICategories {
    name: string;
    subreddits: string[];
}

interface IResponseData {
    subreddit_name: string,
    data: {
        data: any
    }[]
}

interface ISubreddits {
    category_name: string,
    data: {
        subreddit_name: string;
        data: IResponseData[]
    }[]
}

const User = () => {
    const { user, setUser } = useContext(UserContext);
    const [selectedCategory, setCategory] = useState<string>('All');
    const [subreddits, setSubs] = useState<ISubreddits[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchSubs()

    }, [selectedCategory]);

    const logout = async () => {
        const fetch = new Fetch();

        localStorage.removeItem('userId');
        await fetch.logout('/auth/logout')
        setUser(null);
    }

    const changeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setIsLoading(true);
        setCategory(value);
    }

    const fetchSubs = async () => {
        const { categories } = user.data;

        if (selectedCategory === 'All') {

            // Get all the subreddits for the selected categories
            const data: [IResponseData][] = await Promise.all(categories.map(async (category: ICategories) => {
                const res = await Promise.all(category.subreddits.map(subreddit => (
                    fetch(`https://www.reddit.com/r/${subreddit}.json`))));
                const req = await Promise.all(res.map(r => r.json()));
                return req;
            }));

            setSubs(build(data, categories));
            setIsLoading(false);

        } else {
            const category = categories
                .map((category: ICategories): string[] => category.name === selectedCategory ? category.subreddits : [])
                .filter((c: string[]) => c.length > 0);
            const res = await Promise.all(category[0].map((subreddit: string) => (
                fetch(`https://www.reddit.com/r/${subreddit}.json`))));
            const data = await Promise.all(res.map((r: any) => r.json()));

            setSubs(build(data));
            setIsLoading(false);
        }
    }

    // build the data structure
    const build = (x: any, categories?: any) => {
        let arr: any[] = [];

        if (categories) {
            // loop through categories
            arr = categories.map((category: any, i: number) => {
                // loop through subreddits in category
                const data = category.subreddits.map((s: string, j: number) => {
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
            {console.log(subreddits[0])}
            {subreddits[0].data.length ? (
                <div>
                    <div>
                        <p>Category: {selectedCategory}</p>
                        <select name="categories" id="categories" onChange={changeCategory} value={selectedCategory}>
                            <option value="All">All</option>
                            {user.data.categories.map((category: ICategories, i: number) => {
                                return <option key={`${i}-${category}`} value={category.name}>{category.name}</option>
                            })}
                        </select>
                        {user.data.categories.map((category: ICategories, i: number) => {
                            return (
                                <div key={`${i}-${category}`}>
                                    <h3>{category.name}</h3>
                                    <ul>
                                        {category.subreddits.map((data: string, i: number) => {
                                            return <li key={`${i}-${data}`}>{data}</li>
                                        })}
                                    </ul>
                                </div>
                            )
                        })}
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

                            {
                                subreddits.map((d: any, i: number) => {
                                    return <li key={`${d.subreddit_name}-${i}`}>
                                        <p>{d.subreddit_name}</p>
                                        <ul>
                                            {d.data.map((s: { data: { title: string } }) => <li key={`${s.data.title}-${i}`}>{s.data.title}</li>)}
                                        </ul>
                                    </li>
                                })
                            }

                        </div>
                    )}
                </div>
            ) : (
                    <div>
                        <button onClick={logout}>logout</button>

                        <h2>Start Adding Your Favourite Subreddits</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, eveniet soluta, praesentium ea ut repudiandae, perspiciatis neque corrupti perferendis!</p>

                        <GetStartedForm fetchSubs={fetchSubs} />
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