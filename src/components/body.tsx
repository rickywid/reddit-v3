import React from 'react';
import { ISubreddits } from './dash';
import SubredditLink from './subredditLink';

interface IProps {
    selectedCategory: string;
    subreddits: any[];
}

interface IData {
    data: {
        title: string,
        url: string,
        num_comments: number,
        created_utc: number,
        all_awardings: any[],
        stickied: boolean,
        permalink: string,
        is_video: boolean,
        gilded: number,
        thumbnail: string
    }
}

interface IData2 {
    subreddit_name: string;
    data: any[];
}

const Body = ({ selectedCategory, subreddits }: IProps) => {
    return (
        <div>
            {selectedCategory === 'All' && (
                <div>
                    {subreddits.map((subreddit: ISubreddits, i: number) => {
                        const { category_name, data } = subreddit;

                        return data.length > 0 && (
                            <section key={`${category_name}-${i}`}>
                                <h3 id={category_name}>{category_name}</h3>
                                {data.map((d: IData2) => {
                                    const { subreddit_name, data } = d;

                                    return <div key={`${subreddit_name}-${i}`}>
                                        <h4 id={subreddit_name} className="border">{subreddit_name}</h4>
                                        <ul>
                                            {data.map((s: IData, i: number) => {
                                                const { title, url, num_comments, created_utc, all_awardings, stickied, permalink, is_video, gilded, thumbnail } = s.data;
                                                return (
                                                    <SubredditLink
                                                        key={i}
                                                        title={title}
                                                        url={url}
                                                        num_comments={num_comments}
                                                        created_utc={created_utc}
                                                        all_awardings={all_awardings}
                                                        stickied={stickied}
                                                        permalink={permalink}
                                                        is_video={is_video}
                                                        gilded={gilded}
                                                        thumbnail={thumbnail}
                                                    />
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

            {selectedCategory !== 'All' && (
                <section>
                    {subreddits.length ?
                        subreddits.map((d: IData2, i: number) => {
                            const { subreddit_name, data } = d;
                            return <div key={`${subreddit_name}-${i}`}>
                                <h4 id={subreddit_name} className="border">{subreddit_name}</h4>
                                <ul>
                                    {data.map((s: IData, i: number) => {
                                        const { title, url, num_comments, created_utc, all_awardings, stickied, permalink, is_video, gilded, thumbnail } = s.data;
                                        return (
                                            <SubredditLink
                                                key={i}
                                                title={title}
                                                url={url}
                                                num_comments={num_comments}
                                                created_utc={created_utc}
                                                all_awardings={all_awardings}
                                                stickied={stickied}
                                                permalink={permalink}
                                                is_video={is_video}
                                                gilded={gilded}
                                                thumbnail={thumbnail}
                                            />
                                        )
                                    })}
                                </ul>
                            </div>
                        })
                        : <p>No Subreddits</p>}

                </section>
            )}
        </div>
    )
}

export default Body;