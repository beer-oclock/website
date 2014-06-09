#
# Simple rake task to compile Sass and Uflify JS
#

require 'compass'
require 'compass/exec'
require 'uglifier'

task :build do
    puts 'Compiling all yo Sass..'
    print "\t"
    Compass::Exec::SubCommandUI.new(%w(compile)).run!

    puts "\nMinifying all yo JavaScript.."
    File.open('js/main.min.js', 'w') do |file|
        file.write(Uglifier.new(:comments => :none).compile(File.read('js/main.js')))
    end
    puts "\tjs/main.js minified!"
end
