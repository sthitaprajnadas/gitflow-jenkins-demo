# Multibranch CI with Gitflow

Release vs hotfix - Release and hotfix are the only two Gitflow branches that get merged directly into master. But the key difference is that release branches are created off the development branch, while hotfix branches are created directly off the master/main branch.  

![Gitflow workflow ](images/workflow.png?raw=true "Gitflow workflow")

## Gitflow Workflow


Create a feature/* branch from develop.  
Work on the feature.  
Merge feature branch into develop.  
When ready to release, create a release/* branch from develop.  
Finalize the release in the release/* branch.  
Merge the release into both main and develop.  
Tag the release on main for versioning.  

## Docker
```
docker build -t dockerspd/node-demo-app .  
docker push dockerspd/node-demo-app  
docker run -d -p 3100:3000 -v POC\Gitflow-demo\node-gitflow\node-demo-app:/root dockerspd/node-demo-app  

```
## Steps to trigger a Jenkins build from feature branch
```
git flow feature start vX.XX.XXX    []( git flow feature start v1.0.8 )  
git add .  
git commit -m "commit for vX.XX.XXX"  []( ex: git commit -m "comit for v1.0.8 )  
git tag -a vX.XX.XXX -m "tagging for vX.XX.XXX"  []( ex: git tag -a v1.0.8  -m "tagging for v1.0.8"  )  
git push --tags  or git push origin --all --follow-tags
git tag -l --points-at HEAD  []( to check the tag from remote ) 
git push   

git flow feature finish  vX.XX.XXX   []( ex: git flow feature finish  v1.0.8  )   

```
![Feature Branch Image](images/feature-branch.png?raw=true "Feature Branch")

## Steps to trigger a Jenkins build from release branch  
```  
git flow release start vX.XX.XXX    [ git flow feature start v1.0.8 ]  
git add .  
git commit -m "commit for vX.XX.XXX"  [ git commit -m "commit for v1.2.8" ]   
git push  
git push --set-upstream origin release/vX.XX.XXX    [ git push --set-upstream origin release/v1.2.8 ]   
git flow release finish  vX.XX.XXX -m "finishing vX.XX.XXX"  [ git flow release finish  v1.2.8 -m "finishing v1.2.8" ]  
git push --tags  
git push  

```

## Steps to trigger a Jenkins build from hotfix branch  
```
git flow hotfix start vX.XX.XXX   [  git flow hotfix start '0.1.1'  ]   
git add .  
git commit -m "commit for vX.XX.XXX"  [ git commit -m "commit for v0.1.1" ]   

git tag -l --points-at HEAD  []( to check the tag from remote )  
git flow hotfix finish vX.XX.XXX  -m "finshing hotfix for vX.XX.XXX" [  git flow hotfix finish '0.1.1' -m "finshing hotfix for vX.XX.XXX"   ]

git checkout master
git tag -l
git push --tags  
git push  


```

![Hotfix Branch Image](images/hotfix-branch.png?raw=true "Hotfix Branch")  


## Gitflow References  

https://endjin.com/blog/2013/04/a-step-by-step-guide-to-using-gitflow-with-teamcity-part-3-gitflow-commands  

https://endjin.com/blog/2013/04/a-step-by-step-guide-to-using-gitflow-with-teamcity-part-3-gitflow-commands  


```  
git flow init  
git flow init -fd  


git flow feature [list] [-v]  
git flow feature start [-F] <name> [<base>]  
git flow feature finish [-rFkDS] [<name|nameprefix>]  
git flow feature publish <name>  
git flow feature track <name>  
git flow feature diff [<name|nameprefix>]  
git flow feature rebase [-i] [<name|nameprefix>]  
git flow feature checkout [<name|nameprefix>]  
git flow feature pull [-r] <remote> [<name>]  


git flow release start <version>  
git flow release finish <version>  
git flow release publish <name>  
git flow release track <name>  


git flow hotfix start <version>  
git flow hotfix finish <version>  
git flow hotfix publish <version>  
git flow hotfix track <version>  

```
