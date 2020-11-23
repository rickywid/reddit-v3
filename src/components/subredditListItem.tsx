import React, { useState, useRef } from 'react';
import { ICategories } from './dash';

interface IProps {
    categories: ICategories[];
    category: string;
    subredditName: string;
    deleteSub: Function;
    saveCategory: Function;
}

const SubredditListItem = ({ categories, category, subredditName, deleteSub, saveCategory }: IProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(category)
    const selectEl = useRef<HTMLSelectElement>(null);

    const handleOnDelete = async () => {
        deleteSub(subredditName, category);
    }

    const handleOnSave = async () => {
        saveCategory(subredditName, category, selectedCategory);
    }

    const changeCategory = () => {
        setSelectedCategory(selectEl.current!.value);
    }

    return (
        <li className="settings-item">
            <span>{subredditName}</span>
                <div className="settings-item-buttons">
                    <select name="categories" id="categories" onChange={changeCategory} value={selectedCategory} ref={selectEl}>
                        {categories.map((category: any, i: number) => {
                            return <option key={`${i}-${category.category_name}`} value={category.category_name}>{category.category_name}</option>
                        })}
                    </select>
                    <button onClick={handleOnDelete}>Remove</button>
                    <button onClick={handleOnSave} disabled={selectedCategory === category} className={`${selectedCategory !== category ? 'sub-save-btn' : ''}`}>Save</button>
                </div>
        </li>
    )
}

export default SubredditListItem;

// https://fettblog.eu/typescript-react/hooks/#useref