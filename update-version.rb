#!/usr/bin/env ruby
@next_version = -1
File.open("new-version.html", "w") do |output|
    File.open("code-src/partials/footer.js", "r") do |input|
        input.each_line do |line|
            if line =~ /^(\s*)<span>V-(\d+)<\/span>\s*$/
                prefix = $1
                @next_version = $2.to_i + 1
                line = "#{prefix}<span>V-#{@next_version}</span>"
            end
            output.puts line
        end
    end
end
File.rename("new-version.html", "code-src/partials/footer.js")

if @next_version == -1
    $stderr.puts "Version update failed!"
    exit 1
else
    puts "Updated version to #{@next_version}"
end
