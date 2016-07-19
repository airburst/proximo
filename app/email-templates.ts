export const EmailTemplates = {

    invitation: {

        subject: 'You are invited to join a Proximo group',

        text: (groupId: string) => {
            return 'Hi,\n\n' +
                'You have been invited to join a group so that you can see each other\'s position on a map.\n\n' +
                'All you have to do is use the link below in your browser:\n\n' +
                'http://proximo.fairhursts.net?group=' + groupId + '\n\n' +
                'Enjoy!';
        },
        
        html: (groupId: string) => {
            return '<p>Hi,</p>' +
                '<p>You have been invited to join a group so that you can see each other\'s position on a map.</p>' +
                '<p>All you have to do is use the link below in your browser:</p>' +
                '<p><a href="http://proximo.fairhursts.net?group=' + groupId + '" title="Proximo group link">http://proximo.fairhursts.net?group=' + groupId + '</a></p>' +
                '<p>Enjoy!</p>';
        }
    }

};