import React from 'react';
import moment from 'moment';
import { MessageTwoTone, VideoCameraTwoTone, StarTwoTone, PictureTwoTone } from '@ant-design/icons';

interface IProps {
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

const SubredditLink = ({ title, url, num_comments, created_utc, all_awardings, stickied, permalink, is_video, gilded, thumbnail }: IProps) => {
    return (
        <li>
            <a href={url} target="__blank" className={stickied ? 'sticky' : ''} style={{ marginRight: '10px' }}>{title}</a>
            {gilded > 0 && <span style={{ marginRight: '5px' }}><StarTwoTone twoToneColor="#ff9800" /></span>}
            {is_video && <span style={{ marginRight: '5px' }}><VideoCameraTwoTone /></span>}
            {thumbnail && thumbnail !== 'self' && thumbnail !== 'default' && <span style={{ marginRight: '5px' }}> <PictureTwoTone /></span>}
            {all_awardings.map((a: { count: number, icon_url: string, name: string }, i: number) => {
                const { count, icon_url, name } = a;
                return count > 0 ? (
                    <span key={i}>
                        <img src={icon_url} style={{ height: '12px' }} alt={name} />
                    </span>
                ) : '';
            })}
            <a className="comments" href={`${process.env.REACT_APP_REDDIT_URL}/${permalink}`} target="__blank"><MessageTwoTone twoToneColor="#6f8ea3" /> <strong><small>{num_comments}</small></strong></a>
            <small className="created">{moment(created_utc * 1000).fromNow()}</small>
        </li>
    )
}

export default SubredditLink