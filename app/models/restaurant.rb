class Restaurant < ActiveRecord::Base
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  
  attr_accessible :name, :desc
end
