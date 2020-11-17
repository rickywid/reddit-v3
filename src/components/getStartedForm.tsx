import React from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import Fetch from '../lib/fetch';

const initialValues = {
    subreddits: [
        {
            name: ''
        },
    ],
};

interface IProps {
    fetchSubs: Function;
}

interface IFormData {
    subreddits: {
        name: string;
    }[]
}

const GetStartedForm = ({ fetchSubs }: IProps) => {
    const request = new Fetch();

    const handleSubmit = (async(values: IFormData) => {
        try {
            await request.updateSubreddits(values);
        } catch(e) {
            console.log(e)
        } finally {
            fetchSubs();
        } 
    })

    return (
        <div>
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
                                            <div key={index}>
                                                <div>
                                                    <label htmlFor={`subreddits.${index}.name`}>Name</label>
                                                    <Field
                                                        name={`subreddits.${index}.name`}
                                                        placeholder="Jane Doe"
                                                        type="text"
                                                    />

                                                </div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        onClick={() => push({ name: '', email: '' })}
                                    >
                                        Add Friend
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                        <button type="submit">Invite</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default GetStartedForm;
