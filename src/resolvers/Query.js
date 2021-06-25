function feed(parent, args, context, info) {
    return context.prisma.link.findMany()
}
function users(parent, args, context, info) {
    return context.prisma.user.findMany()
}

module.exports = {
    feed,
    users
}