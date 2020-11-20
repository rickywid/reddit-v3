import React, { useState, useContext, useRef } from 'react';
import UserContext from '../context/userContext';

interface IProps {
    id: number;
    name: string;
    renameCategory: Function;
    deleteCategory: Function;
}

const CategoryListItem = ({ id, name, renameCategory, deleteCategory }: IProps) => {
    const { user, setUser } = useContext(UserContext);
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
                    <div>
                        <input type="text" ref={inputRef} defaultValue={name} />
                        <button onClick={handleOnSave}>Save</button>
                        <button onClick={handleOnEdit}>Cancel</button>
                    </div>
                )}

        </li>
    ) : (
            <li key={`${name}`}>
                {name === 'uncategorized' ? (
                    <div>
                        <p>{name}</p>
                    </div>
                ) : (
                        <div>
                            <span>{name}</span>
                            <button onClick={handleOnEdit}>edit</button>
                            <button onClick={handleOnDelete}>delete</button>
                        </div>
                    )}

            </li>
        )
}

export default CategoryListItem;

