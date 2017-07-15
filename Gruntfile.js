
module.exports = function(grunt) {
    //Налаштування збірки Grunt
    var config = {
        //Інформацію про проект з файлу package.json
        pkg: grunt.file.readJSON('package.json'),

        //Конфігурація для модуля browserify (перетворює require(..) в код
        browserify:     {
            //Загальні налаштування (grunt-browserify)
            options:      {

                //brfs замість fs.readFileSync вставляє вміст файлу
                transform:  [ require('brfs') ],
                browserifyOptions: {
                    //Папка з корнем джерельних кодів javascript
                    basedir: "client/src/js/"
                }
            },

            //Збірка з назвою піца
            mygame: {
                src:        'client/src/main.js',
                dest:       'client/www/assets/js/main.js'
            }
        }
    };

    //Налаштування відстежування змін в проекті
    var watchDebug = {
        options: {
            'no-beep': true
        },
        //Назва завдання будь-яка
        scripts: {
            //На зміни в яких файлах реагувати
            files: ['client/src/**/*.js', 'client/**/*.ejs'],
            //Які завдання виконувати під час зміни в файлах
            tasks: ['browserify:mygame']
        }
    };


    //Ініціалузвати Grunt
    config.watch = watchDebug;
    grunt.initConfig(config);

    //Сказати які модулі необхідно виокристовувати
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    //Список завданнь по замовчування
    grunt.registerTask('default',
        [
            'browserify:mygame',
            //Інші завдання які необхідно виконати
        ]
    );

};