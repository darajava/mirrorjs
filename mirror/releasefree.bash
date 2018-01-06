cp config.xml.free config.xml
vim config.xml
cp config.xml config.xml.free

cp www/index.html.free www/index.html

cordova build android --release
cd platforms/android/build/outputs/apk/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../../../mirrorfree.keystore android-release-unsigned.apk mirror
zipalign -f -v 4 android-release-unsigned.apk releasefree.apk
