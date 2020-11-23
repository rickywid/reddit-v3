import { IGetStartedData } from '../components/dash';

// check for duplicate subreddits
// check for invalid subreddits

// --- DONE ----
// check for duplicate categories
// check for duplicate categories when renaming
// check for empty fields

/**
 * Check if category namem already exists when adding or renaming
 * 
 * @param values 
 * @param userCategories 
 * @param userSubreddits 
 */
export const validateCategory = (values: { categories: { name: string }[] }, userCategories?: any, userSubreddits?: any) => {
    const { categories } = values;
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < userCategories.length; j++) {
            if (userCategories[j].category_name === categories[i].name) {
                throw new Error('Duplicate entry found');
            };
        }
    }
}

/**
 * Check for duplicate categories when submitting
 */
export const validateCategorySubmit = (values: string[]) => {
    const isDuplicate = values.filter((item, index) => values.indexOf(item) !== index)
    if (isDuplicate.length) { throw new Error('Duplicate entries found') }
}

export const validateDuplicateSubreddits = (values: IGetStartedData, userSubreddits: any) => {
    const { subreddits } = values;
    for (let i = 0; i < subreddits.length; i++) {
        for (let j = 0; j < userSubreddits.length; j++) {
            for (let k = 0; k < userSubreddits[j].data.length; k++) {
                if (userSubreddits[j].data.includes(subreddits[i].name)) {
                    throw new Error('Duplicate entry found');
                };
            }
        }
    }
}
