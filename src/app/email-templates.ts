const url = 'https://proximate.fairhursts.net/join/';
const getName = (name: string) => {
    return (name) ? name.split(' ')[0] : '';
}
const makeLink = (id: string, name?: string) => {
    return url + id;
};

export const EmailTemplates = {

    invitation: {

        subject: 'New ProxiMate Group',

        text: (id: string, name?: string) => {
            return 'Hi ' + getName(name) + ',\n\n' +
                'You have been invited to join a group that enables you to see each other\'s position on a map.\n\n' +
                'All you have to do is use the link below in your browser:\n\n' +
                makeLink(id) + '\n\n' +
                'Enjoy!';
        },

        html: (id: string, name?: string) => {
            return '<p>Hi ' + getName(name) + ',</p>' +
                '<p>You have been invited to join a group that enables you to see each other\'s position on a map.</p>' +
                '<p>All you have to do is use the link below in your browser:</p>' +
                '<p><a href="' + makeLink(id) + '" title="Proximo group link">' + makeLink(id) + '</a></p>' +
                '<p>Enjoy!</p>';
        }
    }

};