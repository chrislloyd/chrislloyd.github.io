class Article

  def self.path=(path)
    @path = path
  end

  def self.files
    Dir["#{File.expand_path(@path)}/*.md"]
  end

  def self.all
    files.collect {|f| new(f, File.read(f)) }
  end

  def self.find_from_tumblr(tumblr, slug)
    all.find {|p| p.slug == slug && p.tumblr == tumblr }
  end

  def self.[](slug)
    all.find {|p| p.slug == slug }
  end

  attr_accessor :path, :template

  def initialize(path, contents)
    @path, @template = path, contents
  end

  def to_html
    Markdown.new(template).to_html
  end

  def slug
    File.basename(self.path, '.md')
  end

  def title; slot(:title); end
  def tumblr; slot(:tumblr); end

  def published
    Time.local(*slot(:published).match(self.class.date_regexp).to_a[1..-1])
  end

  def <=>(other)
    published <=> other.published
  end

private

  def self.date_regexp
    /(\d+)-(\d+)-(\d+)\s(\d+):(\d+)/
  end

  def slot(name)
    template[/^<!--\s*#{name}:\s*(\S*)\s*-->$/, 1]
  end

end
