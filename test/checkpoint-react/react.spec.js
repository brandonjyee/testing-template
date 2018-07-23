import React from 'react';
import { expect } from 'chai';
import Enzyme,{ shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { spy } from 'sinon';

const adapter = new Adapter()
Enzyme.configure({adapter})

// You will write these components
import AdoptionForm from '../src/components/AdoptionForm';
import AdoptionAgency from '../src/components/AdoptionAgency';
import PetPreview from '../src/components/PetPreview';

describe('React', () => {

  const DOGS = [
    { name: 'Taylor',  imgUrl: 'src/img/taylor.png'  },
    { name: 'Reggie',  imgUrl: 'src/img/reggie.png'  },
    { name: 'Pandora', imgUrl: 'src/img/pandora.png' }
  ];

  const CATS = [
    { name: 'Earl',    imgUrl: 'src/img/earl.png'   },
    { name: 'Winnie',  imgUrl: 'src/img/winnie.png' },
    { name: 'Fellini',  imgUrl: 'src/img/fellini.png' }
  ];


  ///// Adoption Agency /////


  describe('<AdoptionAgency /> component', () => {


    let adoptionAgency;

    beforeEach('Create component', () => {

      // 'shallow' is a method provided by the enzyme library.
      // It performs a 'virtual render', the component, just as if a parent component had rendered it (or just as if
      // we passed it to ReactDOM.render). However, it doesn't render to the real DOM. Instead, it returns a 'wrapper'.
      // This 'wrapper' object contains information about what the rendered component would look like, and provides
      // useful methods for testing it.
      adoptionAgency = shallow(<AdoptionAgency />);

    });

    //
    // has state
    //

    it('has a `petToAdopt` field on its state', () => {

      // ShallowWrapper.state() gives us the current `this.state` of the component
      expect(adoptionAgency.state().petToAdopt).to.exist;

    });

    it('has a `petToAdopt` field initialized to be an empty object', () => {

      expect(adoptionAgency.state().petToAdopt).to.be.an('object');

    });

    //
    // has methods
    //

    it('has a method called `adoptPet`, which takes a pet and sets it as the `petToAdopt` on state', () => {

      const pet = { name: 'Cody', imgUrl: 'cody.png' };

      expect(adoptionAgency.instance().adoptPet).to.be.function;

      adoptionAgency.instance().adoptPet(pet);
      expect(adoptionAgency.state().petToAdopt).to.be.deep.equal(pet);

    });

    it('binds the `adoptPet` method to the context of the component', () => {
      expect(adoptionAgency.instance().adoptPet.hasOwnProperty('prototype')).to.be.false;

    });

    //
    // renders components
    //

    it('renders the name of the petToAdopt in an h3 tag', () => {

      const pet = { name: 'Cody', imgUrl: 'cody.png' };
      adoptionAgency.setState({ petToAdopt: pet });

      expect(adoptionAgency.find('h3').text().trim()).to.be.equal('You are adopting: Cody');

    });

    it('renders two <PetPreview /> components (one for dogs and one for cats)', () => {

      expect(adoptionAgency.find(PetPreview).length).to.be.equal(2);

    });

    //
    // passes props
    //

    it('passes a prop called `pets` with the list of dogs to one of the <PetPreview /> components', () => {

      expect(adoptionAgency.find('#dogs').find(PetPreview).props().pets).to.be.deep.equal(DOGS);

    });

    it('passes a prop called `pets` with the list of cats the other <PetPreview /> component', () => {

      expect(adoptionAgency.find('#cats').find(PetPreview).props().pets).to.be.deep.equal(CATS);

    });

    it('passes the `adoptPet` method to each <PetPreview/> component as a prop called `adoptPet`', () => {

      expect(adoptionAgency.find('#dogs').find(PetPreview).props().adoptPet)
        .to
        .be
        .deep
        .equal(adoptionAgency.instance().adoptPet);

      expect(adoptionAgency.find('#cats').find(PetPreview).props().adoptPet)
        .to
        .be
        .deep
        .equal(adoptionAgency.instance().adoptPet);

    });

  }); // end <AdoptionAgency /> component


  ///// Pet Preview /////


  describe('<PetPreview /> component', () => {

    let petPreview, adoptPetSpy;

    beforeEach('Create component', () => {

      adoptPetSpy = spy();

      // These tests will use DOGS as our pets prop - sorry, cat lovers!
      petPreview = shallow(<PetPreview pets={DOGS} adoptPet={adoptPetSpy} />);

    });

    //
    // has state
    //

    it('has a `petToPreview` field on its state', () => {

      expect(petPreview.state().petToPreview).to.exist;

    });

    it('has a `petToPreview` field initialized to be an empty object', () => {

      expect(petPreview.state().petToPreview).to.be.an('object');

    });

    //
    // has methods
    //

    it('has a method called `previewPet`, which takes an event (whose target.value is a pet name), and sets the pet with the matching name on state', () => {

      // This one will require a little creativity.
      // The event we receive contains the pet name on it, but we want to set a full pet object on state.
      // Where do we have access to the actual pets?
      //
      // Array.prototype.find may also come in handy here:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

      const event = { target: { value: 'Reggie' } };
      const pet = DOGS[1];

      expect(petPreview.instance().previewPet).to.be.function;

      petPreview.instance().previewPet(event);
      expect(petPreview.state().petToPreview).to.be.deep.equal(pet);

    });

    it('has a method called `adoptSelectedPet`, which invokes the `adoptPet` prop and passes it the pet to preview from state', () => {

      expect(petPreview.instance().adoptSelectedPet).to.be.function;

      const pet = DOGS[1];
      petPreview.setState({ petToPreview: pet });
      petPreview.instance().adoptSelectedPet();

      // If these fail, this means that the adoptSpy function is not being called.
      // Look at the shallow wrapper - note how the wrapper gets access to the adoptSpy function
      expect(adoptPetSpy.called).to.be.equal(true);
      expect(adoptPetSpy.calledWith(pet)).to.be.equal(true);

    });

    it('binds the `previewPet` method to the context of the component', () => {

      expect(petPreview.instance().previewPet.hasOwnProperty('prototype')).to.be.false;

    });

    it('binds the `adoptSelectedPet` method to the context of the component', () => {

      expect(petPreview.instance().adoptSelectedPet.hasOwnProperty('prototype')).to.be.false;

    });

    //
    // renders components
    //

    it('renders an <AdoptionForm /> component', () => {

      expect(petPreview.find(AdoptionForm).length).to.be.equal(1);

    });

    it('renders an <img> element with a `src` prop equal to the pet-to-preview\'s imgUrl', () => {

      const taylor = DOGS[0];
      petPreview.setState({ petToPreview: taylor });
      expect(petPreview.find('img').props().src).to.be.equal(taylor.imgUrl);

      const reggie = DOGS[1];
      petPreview.setState({ petToPreview: reggie });
      expect(petPreview.find('img').props().src).to.be.equal(reggie.imgUrl);

    });

    //
    // passes props
    //

    it('passes its own `pets` prop down to <AdoptionForm /> as `pets`', () => {

      expect(petPreview.find(AdoptionForm).props().pets).to.be.deep.equal(petPreview.instance().props.pets);

    });

    it('passes the `previewPet` method down to <AdoptionForm /> as a prop called `previewPet`', () => {

      expect(petPreview.find(AdoptionForm).props().previewPet).to.be.deep.equal(petPreview.instance().previewPet);

    });

    it('passes the `adoptSelectedPet` method down to <AdoptionForm /> as a prop called `adoptSelectedPet`', () => {

      expect(petPreview.find(AdoptionForm).props().adoptSelectedPet).to.be.deep.equal(petPreview.instance().adoptSelectedPet);

    });


  }); // end <PetPreview /> component


  describe('<AdoptionForm /> component', () => {

    let adoptionForm, previewPetSpy, adoptSelectedPetSpy;

    beforeEach('Create component', () => {
      previewPetSpy = spy();
      adoptSelectedPetSpy = spy();

      // we'll use CATS this time ;)
      adoptionForm = shallow(<AdoptionForm pets={CATS} previewPet={previewPetSpy} adoptSelectedPet={adoptSelectedPetSpy} />);
    });

    //
    // renders components
    //

    it('renders a <button> element', () => {

      expect(adoptionForm.find('button').length).to.be.equal(1);

    });

    it('renders a <select> element', () => {

      expect(adoptionForm.find('select').length).to.be.equal(1);

    });

    it('renders an <option> within the <select> for each pet', () => {

      expect(adoptionForm.find('select').find('option').length).to.be.equal(CATS.length);
    });

    it('renders each <option> with a `key` prop and an inner text value equal to that pet\'s name', () => {

      // Loops through each option in the select
      adoptionForm.find('option').forEach((option, idx) => {

        // determines if the option's 'key' prop is equivalent to the pet's name
        expect(option.key()).to.be.equal(CATS[idx].name);

        // determines if the option's inner text is equivalent to the pet's name
        expect(option.text().trim()).to.be.equal(CATS[idx].name);

      });

    });

    it('works for both dogs and cats', () => {

      const dogAdoptionForm = shallow(<AdoptionForm pets={DOGS} />);

      dogAdoptionForm.find('option').forEach((option, idx) => {
        expect(option.key()).to.be.equal(DOGS[idx].name);
        expect(option.text().trim()).to.be.equal(DOGS[idx].name);
      });

    });

    //
    // attaches listeners
    //

    it('attaches the `previewPet` prop as an `onChange` listener for the <select> component', () => {

      expect(adoptionForm.find('select').onChange).to.be.function;

      // ShallowWrapper.simulate can be used to simulate a DOM event.
      // In this case, we simulate a 'change' event (which we can listen for with an 'onChange' handler).
      // The second argument mocks out the 'event' object that the event handler will receive.
      // This means that instead of receiving a full, 'real' event object, the handler will receive this
      // mock event instead
      const mockEvent = { target: { value: 'Earl' } };
      adoptionForm.find('select').simulate('change', mockEvent);

      // The spy sent in should be called with the argument described
      expect(previewPetSpy.calledWith(mockEvent)).to.be.true;

    });

    it('attaches the `adoptSelectedPet` prop as an `onClick` listener for the button', () => {

      expect(adoptionForm.find('button').onClick).to.be.function;

      adoptionForm.find('button').simulate('click', {});

      // The spy sent in should be called with the argument described
      expect(adoptSelectedPetSpy.called).to.be.equal(true);

    });

  }); // end <AdoptionForm /> component

}); // end React specs
