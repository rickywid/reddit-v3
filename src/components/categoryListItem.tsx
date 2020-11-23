import React, { useState, useRef } from 'react';

interface IProps {
    id: number;
    name: string;
    renameCategory: Function;
    deleteCategory: Function;
}

const CategoryListItem = ({ id, name, renameCategory, deleteCategory }: IProps) => {
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
                        <div style={{
                            display: 'flex',
                            width: '247px',
                            marginRight: '20px'
                        }}>
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
                        <p>{name}</p>
                    </div>
                ) : (
                        <div className="settings-item">
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

