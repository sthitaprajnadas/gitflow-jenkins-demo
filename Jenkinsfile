pipeline{

    agent any
    options {
        ansiColor('xterm')    // ansicolor plugin 
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))       
    }
 	environment {
       SERVICE_NAME = 'node-demo-app'
	   DOCKERHUB_CREDENTIALS = credentials('dockerhub')
       DOCKERHUB_ACCOUNT = 'dockerspd'

    }   
    stages { 

        stage('Initialize') {
            agent {
                label "docker"   // Install docker and docker pipeline plugin for this to work
            }

            steps {
                checkout([
                     $class: 'GitSCM',
                     branches: scm.branches,
                     doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
                     extensions: scm.extensions + [[$class: 'CloneOption', noTags: false, reference: '', shallow: true]],
                     submoduleCfg: [],
                     userRemoteConfigs: scm.userRemoteConfigs
                ])
                script {
                    sleep 60
                    def BUILD_BRANCH = env.BRANCH_NAME
                    def BUILD_BRANCH_TYPE = null
                    def BUILD_BRANCH_TASK = null
                    def BUILD_SHA1 = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    def BUILD_TAG = sh(script: "git tag -l --points-at HEAD", returnStdout: true).trim()
                    def BUILD_TYPE = null
                    def BUILD_VERSION = null
                    def matcher = BUILD_BRANCH =~ /(.*)\/(.*)/
                    
/*                     if (BUILD_BRANCH == "master") {
                        BUILD_BRANCH_TYPE = "master"
                        if (BUILD_TAG != "") {
                            BUILD_TYPE = "release"
                            BUILD_VERSION = BUILD_TAG
                            } 
                        else {
                                BUILD_TYPE = "snapshot"
                                BUILD_VERSION = "master-SNAPSHOT"
                            }
                    }  */
                    if (BUILD_BRANCH == "release") {
                        BUILD_BRANCH_TYPE = "release"
                        if (BUILD_TAG != "") {
                            BUILD_TYPE = "snapshot"
                            BUILD_VERSION = BUILD_BRANCH_TYPE + "-" + BUILD_TAG + "-SNAPSHOT"
                            } 
                        else {
                            BUILD_TYPE = "snapshot"
                            BUILD_VERSION = "release-SNAPSHOT"
                            }
                    } 
                    else if (BUILD_BRANCH == "develop") {
                        BUILD_BRANCH_TYPE = "develop"
                        if (BUILD_TAG != "") {
                            BUILD_TYPE = "snapshot"
                            BUILD_VERSION = BUILD_BRANCH_TYPE + "-" + BUILD_TAG + "-SNAPSHOT"
                            } 
                        else {
                            BUILD_TYPE = "snapshot"
                            BUILD_VERSION = "develop-SNAPSHOT"
                            }
                    } 
                    else if ((matcher)) {
                            BUILD_BRANCH_TYPE = matcher.group(1)
                            BUILD_BRANCH_TASK = matcher.group(2)
                            BUILD_TYPE = "snapshot"
                            BUILD_VERSION = BUILD_BRANCH_TYPE 
                            BUILD_TAG = BUILD_VERSION + "-" + BUILD_BRANCH_TASK
                            BUILD_BRANCH_TASK.replaceAll(" ", "-") + "-SNAPSHOT"
                    } else {
                            BUILD_TYPE = "snapshot"
                            BUILD_VERSION = BUILD_BRANCH + "-SNAPSHOT"
                            BUILD_TAG = BUILD_VERSION
                    }

                    env.BUILD_BRANCH = BUILD_BRANCH
                    env.BUILD_BRANCH_TYPE = BUILD_BRANCH_TYPE
                    env.BUILD_BRANCH_TASK = BUILD_BRANCH_TASK
                    env.BUILD_SHA1 = BUILD_SHA1
                    env.BUILD_TAG = BUILD_TAG
                    env.BUILD_TYPE = BUILD_TYPE
                    env.BUILD_VERSION = BUILD_VERSION


                    echo "BUILD_BRANCH: ${BUILD_BRANCH}"  
                    echo "BUILD_BRANCH_TYPE: ${BUILD_BRANCH_TYPE}"                    
                    echo "BUILD_BRANCH_TASK: ${BUILD_BRANCH_TASK}"                    
                    echo "BUILD_SHA1: ${BUILD_SHA1}"                    
                    echo "BUILD_TAG: ${BUILD_TAG}"                    
                    echo "BUILD_TYPE: ${BUILD_TYPE}"                    
                    echo "BUILD_VERSION: ${BUILD_VERSION}"                    
    
                }
            }
  
        }

        stage('Build') {
            steps {
                sh 'npm install'   //install node in jenkins host for this to work
            }
		}
		stage('Docker') {

			steps {
            
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'                		
                echo 'Login Completed'  
                script{

                    if ("${BUILD_TAG}" != ""){
                        echo "setting tag when BUILD_TAG has values"
                        env.TAG = "${BUILD_TAG}"
                    }else{
                        echo "setting tag when BUILD_TAG has no values"
                        env.TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    }

                   
                }
                echo "TAG: ${TAG}"
                // sh '''cp ./Dockerfile  .
                // echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin    
                sh '''            
                docker build -t $DOCKERHUB_ACCOUNT/$SERVICE_NAME:\${TAG} .
                docker push $DOCKERHUB_ACCOUNT/$SERVICE_NAME:\${TAG}
                docker rmi $DOCKERHUB_ACCOUNT/$SERVICE_NAME:\${TAG}'''				
			}
		}

		stage('Deploy') {
			steps {
				sh 'rm -rf $SERVICE_NAME'

				dir ("k8s/helm/$SERVICE_NAME/") {
					sh 'sed -i "s/tag:.*/tag: "\${TAG}"/" values.yaml'
					sh 'cat values.yaml'
					sh 'git add values.yaml'
				}
        		sh 'git clean -fxd'
				script {
                  try {
        				sh "git commit -m 'Jenkins Job changemanifest for $SERVICE_NAME'"
                  } catch (Exception e) {
                      echo 'Exception occurred: ' + e.toString()
                      echo 'Looks like nothing changed from last commit, please check your code'
                      echo 'If there are any config changes, please contact DevOps Team'
                  }
                }
                withCredentials([gitUsernamePassword(credentialsId: 'githubid', gitToolName: 'github')]) 
                {
                    // sh 'git remote set-url origin git@github.com:$DOCKERHUB_CREDENTIALS_USR/repo.git'
                    sh "git push origin HEAD:${BUILD_BRANCH}"

                }                
			}
		}

    }
 
 }