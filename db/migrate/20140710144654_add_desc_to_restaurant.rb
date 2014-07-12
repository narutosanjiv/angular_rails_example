class AddDescToRestaurant < ActiveRecord::Migration
  def change
    add_column :restaurants, :desc, :string
  end
end
