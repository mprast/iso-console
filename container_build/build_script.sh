#! /bin/bash

# This uses acbuild to construct a rkt container that runs the 
# iso console webserver. This attempts to copy the entire 
# repo to /src when it gets run, and it uses acbuild to build 
# a container within the current directory. To avoid a never 
# ending loop, please run this script from outside the repo.

set -e

function vblog {
    # BASH_ARGV contains the args to the script. 
    # $1 is an arg to the function
    if [ ${BASH_ARGV[0]:-''} == '-v' ]
    then
        echo $1 
    fi
}

if [ $EUID -ne 0 ]
   then
   echo 'Please run this build script as root! acbuild needs it.' >&2
   exit 1
fi

acbuild --debug begin docker://node:slim

# In the event of the script exiting, end the build
trap "{ export EXT=$?; acbuild --debug end && exit $EXT; }" EXIT

vblog "Getting the root of the git repo this script is in by using 'git rev-parse --show-cdup'..."
pushd $(dirname $BASH_SOURCE) > /dev/null
# this is gross, but git rev-parse --show-cdup gives us a relative
# path back, and we need to convert it to an absoulte one.
# 'git rev-parse' gets the root of the repo we're currently in.
repo_dir=$(echo $(cd $(git rev-parse --show-cdup); pwd;))
popd > /dev/null

vblog "Copying all of $repo_dir into the image in .acbuild..."
cp -r $repo_dir ./.acbuild/currentaci/rootfs/src

acbuild --debug write '/home/mprast/icbuild_test.aci'
