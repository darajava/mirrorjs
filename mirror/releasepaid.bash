cp config.xml.paid config.xml
vim config.xml
cp config.xml config.xml.paid

cp www/index.html.paid www/index.html

cordova build android --release
cd platforms/android/build/outputs/apk/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../../../mirrorpaid.keystore android-release-unsigned.apk mirror
zipalign -f -v 4 android-release-unsigned.apk releasepaid.apk
