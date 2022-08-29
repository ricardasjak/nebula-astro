export async function get() {
    return {
        body: (new Date()).toISOString(),
    }
}