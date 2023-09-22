module.exports = function getPermissionsFromCookie() {
    permissions = {
        admin: false,
        read: true,
        create: false,
        update: false,
        delete: false
    }
    try {
        const cookies = document.cookie.split(';').map(item => item.split('=')).reduce((acc, [k, v]) => (acc[k.trim().replace('"', '')] = v) && acc, {});
        if (typeof(cookies) !== "undefined") {
            const cookie_perms = cookies['hx-perms'];
            if (cookie_perms.indexOf('kondo-admin') > 0 || cookie_perms.indexOf('kondo-operation') > 0 || cookie_perms.indexOf('kondo-admin') > 0 || cookie_perms.indexOf('kondo-editor') > 0) {
                permissions.admin = true
                permissions.create = true
                permissions.update = true
                permissions.delete = true
            }
            if (cookie_perms.indexOf('kondo-finance') > 0) {
                permissions.update = true
            }
            if (cookie_perms.indexOf('kondo-production') > 0) {
                permissions.update = true
            }
            if (cookie_perms.indexOf('kondo-create-project') > 0) {
                permissions.create = true
            }
            if (cookie_perms.indexOf('kondo-delete-project') > 0) {
                permissions.delete = true
            }
            if (cookie_perms.indexOf('kondo-update-project') > 0) {
                permissions.update = true
            }
        }
    } catch {
        permissions = {
            admin: false,
            read: true,
            create: false,
            update: false,
            delete: false
        }
    }
    return permissions
}