pipeline {

   agent any

    stages {

        stage('Deploy') {
            steps {
                echo 'Deploy...'
                sh 'sudo rm -rf /var/www/html/coll.confimprese.retailin.it/'
                sh 'sudo mv * /var/www/html/coll.confimprese'
            }
        }

    }
}
