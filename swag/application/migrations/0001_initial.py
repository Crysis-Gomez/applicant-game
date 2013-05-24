# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Vacancy'
        db.create_table(u'application_vacancy', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('department', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('slug', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
            ('mail_text', self.gf('django.db.models.fields.CharField')(max_length=500)),
        ))
        db.send_create_signal(u'application', ['Vacancy'])

        # Adding model 'GameInstance'
        db.create_table(u'application_gameinstance', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('uid', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('progress', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('player_position_y', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('player_position_x', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('player_cv_unlockedQuest', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_motivation_uplockedQuest', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_defeated_boss', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('player_email', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('vacancy', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.Vacancy'])),
        ))
        db.send_create_signal(u'application', ['GameInstance'])

        # Adding model 'Meeting'
        db.create_table(u'application_meeting', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('player_name', self.gf('django.db.models.fields.CharField')(default='unknown', max_length=50)),
            ('pub_date', self.gf('django.db.models.fields.DateField')()),
            ('pub_time', self.gf('django.db.models.fields.TimeField')()),
            ('vacancy', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.Vacancy'])),
            ('dateID', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
        ))
        db.send_create_signal(u'application', ['Meeting'])

        # Adding model 'GameData'
        db.create_table(u'application_gamedata', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('position_x', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('position_y', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('cv_unlocked', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('motivation_unlocked', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'application', ['GameData'])

        # Adding model 'PortfolioLinks'
        db.create_table(u'application_portfoliolinks', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('links', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
        ))
        db.send_create_signal(u'application', ['PortfolioLinks'])

        # Adding model 'CvDocument'
        db.create_table(u'application_cvdocument', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('attachment', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
        ))
        db.send_create_signal(u'application', ['CvDocument'])

        # Adding model 'MotivationLetter'
        db.create_table(u'application_motivationletter', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('entry', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('attachment', self.gf('django.db.models.fields.files.FileField')(max_length=100, null=True, blank=True)),
        ))
        db.send_create_signal(u'application', ['MotivationLetter'])


    def backwards(self, orm):
        # Deleting model 'Vacancy'
        db.delete_table(u'application_vacancy')

        # Deleting model 'GameInstance'
        db.delete_table(u'application_gameinstance')

        # Deleting model 'Meeting'
        db.delete_table(u'application_meeting')

        # Deleting model 'GameData'
        db.delete_table(u'application_gamedata')

        # Deleting model 'PortfolioLinks'
        db.delete_table(u'application_portfoliolinks')

        # Deleting model 'CvDocument'
        db.delete_table(u'application_cvdocument')

        # Deleting model 'MotivationLetter'
        db.delete_table(u'application_motivationletter')


    models = {
        u'application.applicationdocumentfiles': {
            'Meta': {'object_name': 'Applicationdocumentfiles', 'db_table': "'ApplicationDocumentFiles'", 'managed': 'False'},
            'data': ('django.db.models.fields.TextField', [], {}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '255', 'primary_key': 'True'}),
            'size': ('django.db.models.fields.IntegerField', [], {})
        },
        u'application.cvdocument': {
            'Meta': {'object_name': 'CvDocument'},
            'attachment': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'application.gamedata': {
            'Meta': {'object_name': 'GameData'},
            'cv_unlocked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'motivation_unlocked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'position_x': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'position_y': ('django.db.models.fields.IntegerField', [], {'default': '5'})
        },
        u'application.gameinstance': {
            'Meta': {'object_name': 'GameInstance'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'player_cv_unlockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_defeated_boss': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_email': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'player_motivation_uplockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'player_position_x': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'player_position_y': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'progress': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'uid': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'vacancy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Vacancy']"})
        },
        u'application.meeting': {
            'Meta': {'object_name': 'Meeting'},
            'dateID': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'player_name': ('django.db.models.fields.CharField', [], {'default': "'unknown'", 'max_length': '50'}),
            'pub_date': ('django.db.models.fields.DateField', [], {}),
            'pub_time': ('django.db.models.fields.TimeField', [], {}),
            'vacancy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Vacancy']"})
        },
        u'application.motivationletter': {
            'Meta': {'object_name': 'MotivationLetter'},
            'attachment': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'entry': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'application.portfoliolinks': {
            'Meta': {'object_name': 'PortfolioLinks'},
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'links': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        u'application.vacancy': {
            'Meta': {'object_name': 'Vacancy'},
            'department': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mail_text': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['application']