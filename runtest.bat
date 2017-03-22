rmdir /s /q coverage
if exist "test\TESTS-xunit.xml" del "test\TESTS-xunit.xml"
SET XUNIT_FILE=test/TESTS-xunit.xml
CALL istanbul cover -x lib/**/* node_modules/mocha/bin/_mocha -- -u exports -R spec-xunit-file test/*.js
CALL istanbul report cobertura --dir coverage/