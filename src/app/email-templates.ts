export const EmailTemplates = {

    invitation: {

        subject: 'You are invited to join a Proximo group',

        text: (id: string) => {
            return 'Hi,\n\n' +
                'You have been invited to join a group so that you can see each other\'s position on a map.\n\n' +
                'All you have to do is use the link below in your browser:\n\n' +
                'http://proximate.fairhursts.net?group=' + id + '\n\n' +
                'Enjoy!';
        },
        
        html: (id: string) => {
            return '<p>Hi,</p>' +
                '<p>You have been invited to join a group so that you can see each other\'s position on a map.</p>' +
                '<p>All you have to do is use the link below in your browser:</p>' +
                '<p><a href="http://proximate.fairhursts.net?group=' + id + '" title="Proximo group link">http://proximo.fairhursts.net?group=' + id + '</a></p>' +
                '<p>Enjoy!</p>';
        }
    }

};