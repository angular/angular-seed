pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                echo "hello, world"
               sh 'docker version'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build . -t himself12794/angular-web-app:latest'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-himself12794', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                    sh "docker login --username $USER --password $PASS"
                }
                sh 'docker push himself12794/angular-web-app:latest'
                withCredentials([usernamePassword(credentialsId: 'ssh-host', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                    sh 'sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@himself12794.com "cd projects/cd-stack; docker-compose up --build -d jenkins"'
                }
            }
        }
        
    }

}
