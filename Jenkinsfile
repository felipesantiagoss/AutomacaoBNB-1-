#!groovy

@Library("bnb-pipeline-library") _

import groovy.json.*;
import groovy.json.JsonSlurper
import java.net.URL

pipeline {
    agent {
        node{
            label 'cypress'
        }
    }
    
    options {
        disableConcurrentBuilds()
        parallelsAlwaysFailFast()
    }
    
    environment {
        CI = 'false'
    }
    
    stages {
        stage('1.Preparação do Ambiente') {
            steps {
            
                echo "$BRANCH_STREAM"
                echo "Ajustando valores de propriedades"
                
                script {
                
                    currentBuild.displayName = "#${currentBuild.id} - $BRANCH_STREAM"
                    
                    //configura diretório com valores da Build Definition RTC
                    env.setProperty("JOB_DIRETORIO", getProperty("team.scm.fetchDestination"))
                    
                    //configura caminho da aplicacao
                    env.setProperty("JOB_CAMINHO_APLICACAO", getProperty("JOB_DIRETORIO") + "/" + getProperty("JOB_COMPONENTE"))
                    
                    //adiciona projeto java caso exista
                    if (getProperty("JOB_PASTA_APLICACAO") != "") {
                        env.setProperty("JOB_CAMINHO_APLICACAO", getProperty("JOB_CAMINHO_APLICACAO") + "/" + getProperty("JOB_PASTA_APLICACAO"))
                    }
                    
                    env.APLICACAO = getProperty("APLICACAO")
                    env.AMBIENTE = "desenvolvimento"
                    env.SXXX = getProperty("SXXX")
                    
                    
                    
                    if (getProperty("BRANCH_STREAM").contains("RELEASE")) {
                        env.AMBIENTE = "release"
                    }

                    if (env.AMBIENTE == "release") {
                        env.CYPRESS_URL_SISTEMA = "https://" + getProperty("APLICACAO") + '-release.tst.ocp.dreads.bnb/'
                    } else {
                        env.CYPRESS_URL_SISTEMA =  "https://" + getProperty("APLICACAO") + '.dev.ocp.dreads.bnb/'
                    }

                }
            
                // baixa artefatos do RTC
                checkout([
                    $class: 'RTCScm',
                    avoidUsingToolkit: false,
                    buildType: [
                    buildStream: "$BRANCH_STREAM",
                    customizedSnapshotName: "$JOB_COMPONENTE $BUILD_TIMESTAMP (Construção - $BRANCH_STREAM - #${currentBuild.id})",
                    overrideDefaultSnapshotName: true,
                    buildSnapshotContext: [
                      snapshotOwnerType: 'none',
                      processAreaOfOwningStream: "$PROJECT_AREA",
                      owningStream: "$BRANCH_STREAM"
                    ],
                    currentSnapshotOwnerType: 'none',
                    value: 'buildStream',
                    processArea: "$PROJECT_AREA",
                    buildStream: "$BRANCH_STREAM",
                    loadDirectory: "$JOB_DIRETORIO",
                    clearLoadDirectory: true,
                    loadPolicy: 'useComponentLoadConfig',
                    createFoldersForComponents: true,
                    componentLoadConfig: 'excludeSomeComponents',
                    componentsToExclude: ''
                    ],
                    timeout: 480
                ])
            }
        }

        stage('2.Testes Funcionais - (UI) - Cypress') {
            steps {
                dir("../$env.JOB_BASE_NAME/$JOB_CAMINHO_APLICACAO") {
                    withNPM(npmrcConfig: 'npm-teste') {
                        sh "echo 'URL : $CYPRESS_URL_SISTEMA'"
                        sh "npm install cypress --save-dev"
                        //Execução com tag para diferenciar testes da entrega e de regressão
                        sh "npx cypress run --headless --browser chrome --e2e"
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: '**/relatorio/', allowEmptyArchive: true, fingerprint: true, onlyIfSuccessful: false
                }
            }
        }
    } //stages
} //pipeline