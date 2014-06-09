#
# Simple rake task to compile Sass and Uflify JS
#

require 'compass'
require 'uglifier'

task :build do

    puts "Compiling all yo Sass.."
    Compass::Exec::SubCommandUI.new(%w(compile)).run!

    puts "\nMinifying all yo JavaScript.."
    File.open('js/main.min.js', 'w') { |file| file.write(Uglifier.new(:comments => :none).compile(File.read('js/main.js'))) }
    puts "js/main.js minified!"

end
