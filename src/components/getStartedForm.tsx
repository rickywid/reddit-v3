import React from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import Fetch from '../lib/fetch';
import { validateCategorySubmit } from '../lib/validation';
import { useState } from 'react';

const initialValues = {
    subreddits: [
        {
            name: ''
        },
    ],
};

interface IProps {
    formSubmit: Function;
}

interface IFormData {
    subreddits: {
        name: string;
    }[]
}


/**
 * Component will render if user has no current subreddits saved
 * 
 * @param param0 
 */

const GetStartedForm = ({ formSubmit }: IProps) => {
    const request = new Fetch();
    const [error, setError] = useState<string>('');

    const handleSubmit = (async (values: IFormData) => {
        try {
            // const data = values.subreddits.map((s: { name: string }) => s.name);
            // validateCategorySubmit(data);
            await request.updateSubreddits(values);
            formSubmit(values);
        } catch (e) {
            console.log(e);
            setError(e.message);
        }
    })

    return (
        <div className="wrap">
            <h1>Invite subreddits</h1>

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form>
                        <FieldArray name="subreddits">
                            {({ insert, remove, push }) => (
                                <div>
                                    {values.subreddits.length > 0 &&
                                        values.subreddits.map((friend, index) => (
                                            <div className="settings-item" key={index}>
                                                <label htmlFor={`subreddits.${index}.name`}>Subreddit</label>
                                                <div className="settings-item-buttons">
                                                    <Field
                                                        name={`subreddits.${index}.name`}
                                                        placeholder="Jane Doe"
                                                        type="text"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        onClick={() => push({ name: '' })}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        Add Subreddit
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                        <button type="submit" disabled={values.subreddits.length ? false : true}>Submit</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default GetStartedForm;
