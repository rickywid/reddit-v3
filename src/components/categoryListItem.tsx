import React, { useState, useRef } from 'react';

interface IProps {
    id: number;
    name: string;
    count: number;
    renameCategory: Function;
    deleteCategory: Function;
}

const CategoryListItem = ({ id, name, renameCategory, deleteCategory, count }: IProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null)

    const handleOnEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleOnSave = () => {
        const { value } = inputRef.current!;
        renameCategory(id, value);
        setIsEditing(!isEditing);
    }

    const handleOnDelete = () => {
        deleteCategory(id, name);
    }

    return isEditing ? (
        <li key={`${name}`}>
            {name === 'uncategorized' ? (
                <div>
                    <p>{name}</p>
                </div>
            ) : (
                    <div className="settings-item">
                        <div className="category-edit">
                            <input type="text" ref={inputRef} defaultValue={name} />
                        </div>

                        <div className="settings-item-buttons">
                            <button onClick={handleOnSave}>Save</button>
                            <button onClick={handleOnEdit}>Cancel</button>
                        </div>
                    </div>
                )}

        </li >
    ) : (
            <li key={`${name}`}>
                {name === 'uncategorized' ? (
                    <div>
                        <p className={`${name === 'uncategorized' ? 'uncategorized' : ''}`}>
                            <div className="count">
                                <small>{count}</small>
                            </div>
                            <span>{name}</span>
                        </p>
                    </div>
                ) : (
                        <div className="settings-item">
                            <div className="count">
                                <small>{count}</small>
                            </div>
                            <span>{name}</span>
                            <div className="settings-item-buttons">
                                <button onClick={handleOnEdit}>Edit</button>
                                <button onClick={handleOnDelete}>Remove</button>
                            </div>
                        </div>
                    )
                }
            </li >
        )
}

export default CategoryListItem;

