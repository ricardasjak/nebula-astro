export const CookieUtil = {
    parseCookie: (cookieHeader: string) => {
        const list: Record<string, string> = {};
        if (!cookieHeader) return list;
    
        cookieHeader.split(`;`).forEach(cookie => {
            let [ name, ...rest] = cookie.split(`=`);
            name = name?.trim() || '';
            if (!name) return;
            const value = rest.join(`=`).trim();
            if (!value) return;
            list[name] = decodeURIComponent(value);
        });
    
        return list;
    }
}