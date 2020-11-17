class Fetch {
    private options: any = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    private domain = 'http://localhost:5000/api'

    async login(url:string) {
        this.options['method'] = 'GET';
        const data = await this.request(url, this.options);
        return data;
    }

    logout(url:string) {
        this.options['method'] = 'GET';
        this.request(url, this.options)
    }

    getUser(id:string) {
        this.options['method'] = 'GET';
        return this.request(`/user/${id}`, this.options)
    }

    updateSubreddits(value: any) {
        this.options['method'] = 'PUT';
        this.options['body'] = JSON.stringify(value);
        return this.request(`/category`, this.options)
    }

    async request(url:string, headers:{}) {
        return await fetch(`${this.domain}${url}`, headers).then((res:Response) => {
            return res.json();
        });
    }
}

export default Fetch;