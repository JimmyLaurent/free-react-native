#!/bin/sh

# Modify this to your device's IP address.
DEVICE_IP=127.0.0.1
DEVICE_PORT=2222


# Verify that the build is for iOS Device and not a Simulator.
if [[ "$NATIVE_ARCH" != "i386" && "$NATIVE_ARCH" != "x86_64" && "${CONFIGURATION}" = "Debug" ]]; then
# Kill any running instances and remove the app folder.
ssh -p $DEVICE_PORT root@$DEVICE_IP "killall ${PRODUCT_NAME}; rm -rf /Applications/${WRAPPER_NAME}"

# Copy it over.
scp -P $DEVICE_PORT -r $BUILT_PRODUCTS_DIR/${WRAPPER_NAME} root@$DEVICE_IP:/Applications/
scp -P $DEVICE_PORT ${SRCROOT}/../deb/package.entitlements root@$DEVICE_IP:/Applications/${WRAPPER_NAME}/package.entitlements
ssh -p $DEVICE_PORT root@$DEVICE_IP "ldid -S/Applications/${WRAPPER_NAME}/package.entitlements /Applications/${WRAPPER_NAME}/${PRODUCT_NAME}"
ssh -p $DEVICE_PORT root@$DEVICE_IP "rm -S/Applications/${WRAPPER_NAME}/package.entitlements"
ssh -p $DEVICE_PORT root@$DEVICE_IP "su -c uicache mobile"
terminal-notifier -title "Build ${CONFIGURATION} Complete " -message "${WRAPPER_NAME} installed on ${DEVICE_IP}"
fi

if [ "${CONFIGURATION}" = "Release" ]; then
# Self sign the build.
ldid -S${SRCROOT}/${TARGETNAME}/package.entitlements  $BUILT_PRODUCTS_DIR/${WRAPPER_NAME}/${PRODUCT_NAME}
rm -rfv ${SRCROOT}/../deb/package/Applications/
mkdir ${SRCROOT}/../deb/package/Applications/
cp -rf $BUILT_PRODUCTS_DIR/${WRAPPER_NAME} ${SRCROOT}/../deb/package/Applications/
dpkg-deb -b ${SRCROOT}/../deb/package ${SRCROOT}/../deb/
terminal-notifier -title "Build ${CONFIGURATION} Complete " -message "${WRAPPER_NAME} generated"
fi