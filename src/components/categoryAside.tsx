import React from 'react';
import { ICategories } from './dash';

interface IProps {
    selectedCategory: string;
    categories : any[];
}

const CategoryAside = ({ selectedCategory, categories }: IProps) => {
    return (
        <div>
            {selectedCategory === 'All' ? categories.map((category: ICategories, i: number) => {
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
                categories.map((category: ICategories, i: number) => {
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
        </div>
    )
}

export default CategoryAside;