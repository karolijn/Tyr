DEST_CHROME_DIR = 'Tyr.chromeextension'

namespace :chrome do
  desc "Copy needed files into chrome directory"
  task :setup do
    files = %w(
      global.js
      inject.js
      style.css
      lib/jquery.tools.min.js
      lib/md5.js
      icons/icon.png
      icons/postrank-128.png
      icons/postrank-64.png
      icons/postrank-16.png
    )

    files.each { |f| FileUtils.cp(f, DEST_CHROME_DIR) }
  end

  task :clean do
    files = %w(
      global.js
      inject.js
      style.css
      jquery.tools.min.js
      md5.js
      icon.png
      postrank-128.png
      postrank-64.png
      postrank-16.png
    )

    files.each { |f| FileUtils.rm("#{DEST_CHROME_DIR}/#{f}") }
  end
end
