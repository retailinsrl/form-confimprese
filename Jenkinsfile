pipeline {

   agent any

    stages {

        stage('Deploy') {
            steps {
                echo 'Deploy...'
                sh 'sudo rsync -av --delete --exclude=".git/" ./ /var/www/html/coll.confimprese.retailin.it/'
            }
        }

    }
}
