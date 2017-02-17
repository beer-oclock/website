#
# Simple rake task to compile Sass and Uflify JS
#

require 'compass'
require 'compass/exec'

task :build do
    puts 'Compiling all yo Sass..'
    print "\t"
    Compass::Exec::SubCommandUI.new(%w(compile)).run!
end
