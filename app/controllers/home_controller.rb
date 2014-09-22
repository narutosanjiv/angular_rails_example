class HomeController < ApplicationController
  
  def index
    if request.xhr?
      render :layout => false
    end
  end
  
  def form
    render :layout => false
  end
  
  def pagination

  end
  
  def filter

  end

  def directive

  end
end
