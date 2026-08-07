module.exports = function getPermissionsFromCookie() {
    permissions = {
        admin: false,
        read: true,
        create: false,
        update: false,
        delete: false,
        credentials: false,
        kondoIt: false
    }
    try {
        const cookies = document.cookie.split(';').map(item => item.split('=')).reduce((acc, [k, v]) => (acc[k.trim().replace('"', '')] = v) && acc, {});
        if (typeof(cookies) !== "undefined") {
            const cookie_perms = cookies['hx-perms'];
            if (cookie_perms.indexOf('kondo-admin') !== -1 || cookie_perms.indexOf('kondo-operation') !== -1 || cookie_perms.indexOf('kondo-editor') !== -1) {
                permissions.admin = true
                permissions.create = true
                permissions.update = true
                permissions.delete = true
            }
            if (cookie_perms.indexOf('kondo-finance') !== -1) {
                permissions.update = true
            }
            if (cookie_perms.indexOf('kondo-production') !== -1) {
                permissions.update = true
            }
            if (cookie_perms.indexOf('kondo-create-project') !== -1) {
                permissions.create = true
            }
            if (cookie_perms.indexOf('kondo-delete-project') !== -1) {
                permissions.delete = true
            }
            if (cookie_perms.indexOf('kondo-update-project') !== -1) {
                permissions.update = true
            }
            if (cookie_perms.indexOf('kondo-admin') !== -1 || cookie_perms.indexOf('kondo-it') !== -1) {
                permissions.credentials = true
            }
            if (cookie_perms.indexOf('kondo-it') !== -1) {
                permissions.kondoIt = true
            }
        }
    } catch {
        permissions = {
            admin: false,
            read: true,
            create: false,
            update: false,
            delete: false,
            credentials: false,
            kondoIt: false
        }
    }
    return permissions
}