#!/bin/bash
echo -e "------更新代码------"
git pull
npm config set registry http://npm.momo.com/
yarn config set registry http://npm.momo.com/
echo -e "------安装依赖------"
yarn install
echo -e "------打包页面------"
yarn run build

if [[ -e dist_index ]]
then
  echo -e "------备份页面------"
  rm -rf backup
  mv dist_index backup
fi

if [[ -e dist ]]
then
  echo -e "------打包成功，重命名文件夹------"
  mv dist dist_index
else
  echo -e "------打包失败，回滚backup文件夹------"
  mv backup dist_index
fi
