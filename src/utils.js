/* eslint-disable import/prefer-default-export */
export function mergeListeners (scopes, renamer) {
    const allListenerKeys = Array.from(new Set(scopes.reduce((acc, scope) => [...acc, ...Object.keys(scope)], [])))
    return allListenerKeys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: ((...args) => {
                const renamedKey = (renamer || {})[key] || key
                scopes.forEach((scope) => (scope[renamedKey]?.(...args)))
            }),
        }),
        {},
    )
}

export function clamp (value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max)
}
