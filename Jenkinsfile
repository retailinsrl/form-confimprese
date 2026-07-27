pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10')) 
        timeout(time: 10, unit: 'MINUTES')            
        disableConcurrentBuilds()                     
    }

    // Variabili riutilizzabili per pulizia del codice
    environment {
        TARGET_DIR = '/var/www/html/coll.confimprese.retailin.it/'
    }

    stages {
        stage('Deploy') {
            steps {
                echo "Inizio del deploy in: ${env.TARGET_DIR}"
                
                sh '''
                    sudo rsync -avc --delete \
                        --chmod=D755,F644 \
                        --exclude=".git/" \
                        --exclude=".gitignore" \
                        ./ ${TARGET_DIR}
                '''
            }
        }
    }

    post {
        success {
            echo 'Deploy completato con successo!'
        }
        failure {
            echo 'ERRORE: Il deploy è fallito!'
        }
    }
}
