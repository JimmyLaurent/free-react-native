# free-react-native

[![npm](https://img.shields.io/npm/dm/free-react-native.svg?maxAge=2592000)](https://npm-stat.com/charts.html?package=free-react-native)

Tool to setup your react-native project to build deb packages for jailbroken devices.

Only works on real jailbroken devices and only on MacOsx.

## Usage

Prerequisites:
- dpkg => brew install dpkg
- ldid => brew install ldid
- terminal-notifier => brew install terminal-notifier

Configure ssh keys to easily connect to your iphone => https://gist.github.com/DomiR/8870918

```bash
npm i -g free-react-native
cd your-react-native-project
free-react-native
```

## Overview

- add script commands to "package.json" to build and deploy,
- create a "deb/package" folder wich contains the structure of your future deb package, 
- edit the xcode pbxproj to remove code signing and add a post build script
- add a post build script ("deb/postBuildScript.sh") to deploy and sign your package with "ldid"
- add a deploy script ("deb/deploy.sh"), you have to customize it.


## TODO
- use a real template and replace the package name in scripts and "control" file
- clean the scripts
