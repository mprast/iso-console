#! /bin/bash

# This uses acbuild to construct a rkt container that runs the 
# iso console webserver. This attempts to copy the entire 
# repo to /src when it gets run, and it uses acbuild to build 
# a container within the current directory. To avoid a never 
# ending loop, please run this script from outside the repo.

set -e

if [ $EUID -ne 0 ]
   then
   echo 'Please run this build script as root! acbuild needs it.' >&2
   exit 1
fi

acbuild --debug begin docker://node:slim

# In the event of the script exiting, end the build
trap "{ export EXT=$?; acbuild --debug end && exit $EXT; }" EXIT

pushd $(dirname $BASH_SOURCE)
# this is gross, but git rev-parse --show-cdup gives us a relative
# path back, and we need to convert it to an absoulte one.
# 'git rev-parse' gets the root of the repo we're currently in.
repo_dir=$(echo $(cd $(git rev-parse --show-cdup); pwd;))
popd

cp -r $repo_dir ./.acbuild/currentaci/rootfs/src

acbuild --debug write '/home/mprast/icbuild_test.aci'
