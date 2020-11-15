import Item from '@/views/Item/Item';
import Vue from 'vue';
 
describe('Item.vue', () => {
 
  it('displays items from the list', () => {
      // our test goes here
      
// build component
const Constructor = Vue.extend(Item);
const ItemComponent = new Constructor().$mount();
expect(ItemComponent.$el.textContent).to.contain('play games');
  })
})


