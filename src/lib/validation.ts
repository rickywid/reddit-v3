import { IGetStartedData } from '../components/dash';

// check for duplicate subreddits
// check for invalid subreddits

// --- DONE ----
// check for duplicate categories
// check for duplicate categories when renaming
// check for empty fields

/**
 * Check for duplicate category names when adding and renaming
 * 
 * @param values 
 * @param userCategories 
 * @param userSubreddits 
 */
export const validateCategory = (values: { categories: { name: string }[] }, userCategories?: any, userSubreddits?: any) => {
    const { categories } = values;
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < userCategories.length; j++) {
            if (userCategories[j].name === categories[i].name) {
                throw new Error('Duplicate entry found');
            };
        }
    }
}

export const validateDuplicateSubreddits = (values: IGetStartedData, userSubreddits: any) => {
    const { subreddits } = values;
    for (let i = 0; i < subreddits.length; i++) {
        for (let j = 0; j < userSubreddits.length; j++) {
            for (let k = 0; k < userSubreddits[j].subreddits.length; k++) {
                if (userSubreddits[j].subreddits.includes(subreddits[i].name)) {
                    throw new Error('Duplicate entry found');
                };
            }
        }
    }
}
