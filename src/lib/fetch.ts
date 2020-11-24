class Fetch {
    private options: any = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    private domain = `${process.env.REACT_APP_SERVER}/api`

    async login(url:string) {
        this.options['method'] = 'GET';
        const data = await this.request(url, this.options);
        return data;
    }

    logout(url:string) {
        this.options['method'] = 'GET';
        this.request(url, this.options)
    }

    getUser() {
        this.options['method'] = 'GET';
        return this.request(`/user`, this.options)
    }

    // Todo: Rename function to "updateCategories"
    updateSubreddits(value: any) {
        this.options['method'] = 'PUT';
        this.options['body'] = JSON.stringify(value);
        return this.request(`/category`, this.options)
    }

    updateSubreddit(value: any) {
        this.options['method'] = 'PUT';
        this.options['body'] = JSON.stringify(value);
        return this.request(`/subreddit`, this.options)
    }

    createCategory(value: {name: string}) {
        this.options['method'] = 'POST';
        this.options['body'] = JSON.stringify(value);
        return this.request(`/category`, this.options)
    }

    renameCategory(value: {id: number, category: string}) {
        this.options['method'] = 'PUT';
        this.options['body'] = JSON.stringify(value);
        return this.request(`/category/rename`, this.options)
    }

    deleteCategory(value: {mergedSubs: string[], category: string}) {
        this.options['method'] = 'PUT';
        this.options['body'] = JSON.stringify(value);
        return this.request(`/category/delete`, this.options)
    };

    async request(url:string, headers:{}) {
        return await fetch(`${this.domain}${url}`, headers).then((res:Response) => {
            if(res.ok === false) {
                return null;
            }
            
            return res.json();
        });
    }
}

export default Fetch;