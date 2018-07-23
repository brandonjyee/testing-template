'use strict';

const Promise = require('bluebird')
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai)

const Article = require('../server/models/article');
const User = require('../server/models/user');
const db = require('../server/models/database');

/**
 *
 * Start here!
 *
 * These tests describe the model that you'll be writing in models/article.js
 *
 */

describe('The `Article` model', () => {

  /**
   * First we clear the database and recreate the tables before beginning a run
   */
  before(() => {
    return db.sync({force: true});
  });

  /**
   * Next, we create an (un-saved!) article instance before every spec
   */
  const fullText = 'The South African cliff swallow (Petrochelidon spilodera), also known as the South African swallow, is a species of bird in the Hirundinidae family.';

  let article;
  beforeEach(() => {
    article = Article.build({
      title: 'Migratory Birds',
      content: fullText
    });
  });

  /**
   * Also, we empty the tables after each spec
   */
  afterEach(() => {
    return Promise.all([
      Article.truncate({ cascade: true }),
      User.truncate({ cascade: true })
    ]);
  });

  describe('attributes definition', () => {

    /**
     * Your model should have two fields (both required): `title` and `content`.
     *
     * http://docs.sequelizejs.com/manual/tutorial/models-definition.html
     */
    it('includes `title` and `content` fields', () => {

      return article.save()
      .then((savedArticle) => {
        expect(savedArticle.title).to.equal('Migratory Birds');
        expect(savedArticle.content).to.equal(fullText);
      });

    });

    it('requires `content`', () => {

      article.content = null;

      return article.validate()
      .then(() => {
        throw new Error('validation should fail when content is null');
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error);
      });

    });

    /**
     * You may want a refresher on Sequelize's validate configurations:
     *
     * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations
     */
    it('requires `title` (in a more strict way than for `content`)', () => {

      article.title = '';

      return article.validate()
      .then(() => {
        throw new Error('validation should fail when content is empty');
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error);
        expect(result.message).to.contain('Validation error');
      });

    });

    /**
     * Some data types allocate more space than others.
     * You can check out the full list of types here:
     *
     * http://docs.sequelizejs.com/variable/index.html#static-variable-DataTypes
     */
    it('can handle long `content`', () => {

      let articleContent = 'WALL-E (stylized with an interpunct as WALL·E) is a 2008 American computer-animated science-fiction comedy film produced by Pixar Animation Studios and released by Walt Disney Pictures. Directed by Andrew Stanton, the story follows a robot named WALL-E, who is designed to clean up an abandoned, waste-covered Earth far in the future. He falls in love with another robot named EVE, who also has a programmed task, and follows her into outer space on an adventure that changes the destiny of both his kind and humanity. Both robots exhibit an appearance of free will and emotions similar to humans, which develop further as the film progresses.';

      return Article.create({
        title: 'WALL-E',
        content: articleContent
      })
      .then((result) => {
        expect(result).to.be.an('object');
        expect(result.title).to.equal('WALL-E');
        expect(result.content).to.equal(articleContent);
      });

    });

  });

/**
 * SPECIAL NOTE: at this point, you have defined enough of the Article model to
 * move on to the Routes tests. The rest of these specs, while necessary to
 * fully pass the Model suite, are not necessary for the Routes suite. Bear in
 * mind that the Routes suite depends on a WORKING model, so if you break the
 * Article model in your code below, the Routes will also fail. Make commits!
 */

  describe('options definition', () => {

    describe('`truncate` instance method', () => {

      beforeEach(() => {
        sinon.spy(article, 'update')
        sinon.spy(article, 'save')
        sinon.spy(Article, 'update')
      });

      afterEach(() => {
        article.update.restore()
        article.save.restore()
        Article.update.restore()
      });

      /**
       * Set up an instance method (check out sequelize instanceMethods) called `truncate`
       * that will shorten (change!) the article instance content to a passed-in length.
       * This method does not save to the backend, it just modifies the Sequelize
       * object so the user can choose if and when to actually save.
       *
       * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#expansion-of-models
       */
      it('truncates the `content`', () => {

        expect(article.content).to.equal(fullText);

        article.truncate(12);
        expect(article.content).to.equal('The South Af');

      });

      it('accepts any length', () => {

        expect(article.content).to.equal(fullText);

        let randLength = Math.ceil(Math.random() * 20);
        article.truncate(randLength);
        expect(article.content).to.have.length(randLength);

      });

      it('does not save the instance once truncated', (done) => {

        expect(article.content).to.equal(fullText);

        article.truncate(7);
        expect(article.content).to.have.length(7);

        // we are *not* asking you to change the row in the db!
        /* eslint-disable no-unused-expressions */
        expect(article.update).not.to.have.been.called;
        expect(article.save).not.to.have.been.called;
        expect(Article.update).not.to.have.been.called;
        /* eslint-enable no-unused-expressions */

        // seriously don't do it
        setTimeout(() => {
          Article.findAll()
          .then((articles) => {
            expect(articles).to.have.length(0);
            done();
          });
        }, 100);

      });

    });

    describe('`findByTitle` class method', () => {

      /**
       * Set up a class method called `findByTitle` that's a convenience
       * method to find a *single* document by its title.
       *
       * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#expansion-of-models
       */

      beforeEach(() => {
        let otherArticles = [1, 2, 3].map((num) => {
          return Article.create({
            title: 'Article Number ' + num,
            content: 'etc.'
          });
        });
        let articles = otherArticles.concat(article.save());
        return Promise.all(articles);
      });

      it('finds one specific article by its `title`', () => {

        return Article.findByTitle('Migratory Birds')
        .then((foundArticle) => {
          expect(foundArticle).not.to.be.an.instanceOf(Array);
          expect(foundArticle.content).to.equal(fullText);
        });

      });

    });

  });

  describe('associations', () => {

    /**
     * Add a `belongsTo` relationship between articles and users,
     * but make sure the user is aliased as `author` for each article.
     *
     * http://docs.sequelizejs.com/manual/tutorial/associations.html#belongsto
     */

    it("belongs to a user, who is stored as the article's `author`", () => {

      let creatingUser = User.create({ name: 'Alatar the Blue'});
      let creatingArticle = Article.create({
        title: 'Blue Wizards',
        content: 'They are two of the five Wizards (or Istari) sent by the Valar to Middle-earth to aid in the struggle against Sauron.'
      });

      return Promise.all([creatingUser, creatingArticle])
      .spread((createdUser, createdArticle) => {
        // this method `setAuthor` method automatically exists if you set up the association correctly
        return createdArticle.setAuthor(createdUser);
      })
      .then(() => {
        return Article.findOne({
          where: { title: 'Blue Wizards' },
          include: { model: User, as: 'author' }
        });
      })
      .then((foundArticle) => {
        expect(foundArticle.author).to.exist; // eslint-disable-line no-unused-expressions
        expect(foundArticle.author.name).to.equal('Alatar the Blue');
      });

    });

  });

  /**
   * Your model should have a field called `version`,
   * which increases by 1 every time you save
   *
   * http://docs.sequelizejs.com/manual/tutorial/hooks.html
   */

  describe('`version` field', () => {

    beforeEach(() => {
      return Article.create({
        title: 'Biological Immortality',
        content: 'Biological immortality refers to a stable or decreasing rate of mortality from senescence, thus decoupling it from chronological age.'
      });
    });

    it('is originally 0, even if not explicitly set', () => {

      return Article.findOne({where: {title: 'Biological Immortality'}})
      .then((foundArticle) => {
        expect(foundArticle.version).to.equal(0);
      });

    });

    it('increments by 1 every time the article is updated', () => {

      return Article.findOne({where: {title: 'Biological Immortality'}})
      .then((foundArticle) => {
        expect(foundArticle.version).to.equal(0);
        return foundArticle.update({
          content: 'Biological immortality is a lie!'
        });
      })
      .then((updatedArticle) => {
        expect(updatedArticle.version).to.equal(1);
        return updatedArticle.update({
          content: 'Have you seen the 19th century painting of Keanu Reeves?'
        });
      })
      .then((updatedArticle) => {
        expect(updatedArticle.version).to.equal(2);

        // "reload" the article from the database,
        // just to make sure that the changes to the version
        // are saved properly!
        return updatedArticle.reload();
      })
      .then((reloadedArticle) => {
        expect(reloadedArticle.version).to.equal(2);
      });

    });

  });

  describe('extra credit `tags` field', () => {

    /** EXTRA CREDIT
     * Your Article model should have a tag field that's an array, but when we
     * access it, we should get one string: the tags joined by a comma and space
     *
     * Look at getters and setters:
     * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#getters-setters
     *
     * To activate this spec, change `xit` to `it`
     */
    it('is a custom getter', () => {

      // tags should have a `defaultValue` that is an empty array.
      expect(Article.attributes.tags.defaultValue).to.deep.equal([]);

      // main functionality of tags
      return Article.create({
        title: 'Taggy',
        content: 'So Taggy',
        tags: ['tag1', 'tag2', 'tag3']
      })
      .then((createdArticle) => {
        expect(createdArticle.tags).to.equal('tag1, tag2, tag3');
      });

    });

  });

});
